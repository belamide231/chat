﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    public partial class InitialRawSqlMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                CREATE TABLE tbl_users (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    user VARCHAR(99) UNIQUE,
                    INDEX idx_user(user)
                );

                CREATE TABLE tbl_messages (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    content_text TINYINT,
                    content_file TINYINT,
                    content VARCHAR(7999),
                    sender_id INT,
                    receiver_id INT,
                    content_seen TINYINT DEFAULT 0,
                    FOREIGN KEY(sender_id) REFERENCES tbl_users(id),
                    FOREIGN KEY(receiver_id) REFERENCES tbl_users(id),
                    INDEX idx_sent_at(sent_at),
                    INDEX idx_sender_id(sender_id),
                    INDEX idx_receiver_id(receiver_id)
                );

                CREATE TABLE tbl_messages_head (
                    message_id INT,
                    sender_id INT,
                    receiver_id INT,
                    FOREIGN KEY(message_id) REFERENCES tbl_messages(id),
                    FOREIGN KEY(sender_id) REFERENCES tbl_users(id),
                    FOREIGN KEY(receiver_id) REFERENCES tbl_users(id),
                    INDEX idx_message_id(message_id),
                    INDEX idx_sender_id(sender_id),
                    INDEX idx_receiver_id(receiver_id)
                );

                CREATE TABLE tbl_messages_head_logs (
                    id INT PRIMARY KEY AUTO_INCREMENT,
                    sent_at DATETIME,
                    sender_id INT,
                    receiver_id INT,
                    INDEX idx_sender_id(sender_id),
                    INDEX idx_receiver_id(receiver_id)
                );

                CREATE TABLE tbl_messages_logs (
                    head_id INT,
                    sent_at DATETIME,
                    content_text TINYINT,
                    content_file TINYINT,
                    content VARCHAR(7999),
                    sender_id INT,
                    receiver_id INT,
                    content_seen TINYINT DEFAULT 0,
                    FOREIGN KEY(head_id) REFERENCES tbl_messages_head_logs(id),
                    INDEX idx_sent_at(sent_at),
                    INDEX idx_sender_id(sender_id),
                    INDEX idx_receiver_id(receiver_id)
                );

                -- Procedures without DELIMITER
                CREATE PROCEDURE get_user_id(IN in_user VARCHAR(20), OUT out_id INT)
                BEGIN
                    SELECT 
                        id INTO out_id
                    FROM tbl_users
                    WHERE 
                        user = in_user
                    LIMIT 1;
                END;

                CREATE PROCEDURE insert_message(
                    IN in_sent_at DATETIME,
                    IN in_content_text TINYINT,
                    IN in_content_file TINYINT,
                    IN in_content VARCHAR(7999),
                    IN in_sender VARCHAR(20),
                    IN in_receiver VARCHAR(20)
                )
                BEGIN
                    CALL get_user_id(in_sender, @sender_id);
                    CALL get_user_id(in_receiver, @receiver_id);
                    
                    IF @sender_id IS NULL THEN 
                        INSERT INTO tbl_users(user) VALUES (in_sender);
                        SET @sender_id = LAST_INSERT_ID();
                    END IF; 
                    
                    IF @receiver_id IS NULL THEN 
                        INSERT INTO tbl_users(user) VALUES (in_receiver);
                        SET @receiver_id = LAST_INSERT_ID();
                    END IF;
                    
                    INSERT INTO tbl_messages (
                        sent_at, 
                        content_text, 
                        content_file, 
                        content, 
                        sender_id, 
                        receiver_id
                    )
                    VALUES (
                        in_sent_at, 
                        in_content_text, 
                        in_content_file, 
                        in_content, 
                        @sender_id, 
                        @receiver_id
                    );
                    
                    SET @new_message_id = (SELECT LAST_INSERT_ID());
                    SET @pre_message_id = (
                        SELECT message_id 
                        FROM tbl_messages_head 
                        WHERE 
                            (sender_id = @sender_id AND receiver_id = @receiver_id) 
                        OR 
                            (sender_id = @receiver_id AND receiver_id = @sender_id)
                    );

                    SELECT 
                        in_receiver AS receiver,
                        id
                    FROM tbl_messages
                    WHERE 
                        id = @new_message_id
                    LIMIT 1;

                    IF @pre_message_id IS NOT NULL THEN 
                        UPDATE tbl_messages_head 
                        SET message_id = @new_message_id, sender_id = @sender_id, receiver_id = @receiver_id 
                        WHERE message_id = @pre_message_id;
                    ELSE 
                        INSERT INTO tbl_messages_head(message_id, sender_id, receiver_id)
                        VALUES (@new_message_id, @sender_id, @receiver_id);
                    END IF;
                END;

                CREATE PROCEDURE get_conversations_heads (IN in_user VARCHAR(20))
                BEGIN
                
                    CALL get_user_id(in_user, @user_id);
                    
                    WITH selected_message_id AS (
                        SELECT 
                        CASE
                            WHEN sender_id != @user_id 
                            THEN sender_id
                            ELSE receiver_id
                        END AS chatmate_id,
                        message_id
                        FROM tbl_messages_head
                        WHERE 
                        @user_id IN (sender_id, receiver_id)
                    )
                    SELECT
                        t1.chatmate_id,
                        t2.*
                    FROM selected_message_id as t1
                    JOIN tbl_messages as t2
                        ON t1.message_id = t2.id
                    ORDER BY sent_at DESC
                    LIMIT 30;
                END;

                CREATE PROCEDURE get_conversation(
                    IN in_user VARCHAR(20),
                    IN in_chatmate VARCHAR(20)
                )
                BEGIN
                    CALL get_user_id(in_user, @user_id);
                    CALL get_user_id(in_chatmate, @chatmate_id);
                    
                    IF @user_id = @chatmate_id
                    THEN 
                        SELECT
                        @chatmate_id AS chatmate_id,
                            id,
                            sent_at,
                            content_text,
                            content_file,
                            content,
                            sender_id,
                            receiver_id,
                            content_seen
                        FROM tbl_messages
                        WHERE 
                            (sender_id = @user_id AND receiver_id = $user_id)
                        ORDER BY sent_at DESC
                        LIMIT 30;
                    ELSE
                        SELECT
                            @chatmate_id AS chatmate_id,
                            id,
                            sent_at,
                            content_text,
                            content_file,
                            content,
                            sender_id,
                            receiver_id,
                            content_seen
                        FROM tbl_messages
                        WHERE 
                            @user_id IN (sender_id, receiver_id)
                        AND 
                            @chatmate_id IN (sender_id, receiver_id)
                        ORDER BY sent_at DESC
                        LIMIT 30;
                    END IF;
                END;

                CREATE PROCEDURE relocate_conversation_to_logs(
                    IN in_user1 VARCHAR(20),
                    IN in_user2 VARCHAR(20)
                )
                BEGIN
                    CALL get_user_id(in_user1, @user1_id);
                    CALL get_user_id(in_user2, @user2_id);

                    IF (@user1_id IS NOT NULL AND @user2_id IS NOT NULL) THEN
                        CREATE TEMPORARY TABLE temp_selected_messages_id AS
                        SELECT id
                        FROM tbl_messages
                        WHERE 
                            (sender_id = @user1_id AND receiver_id = @user2_id)
                        OR 
                            (sender_id = @user2_id AND receiver_id = @user1_id)
                        ORDER BY sent_at DESC;
                        
                        SET @head = (
                            SELECT id
                            FROM temp_selected_messages_id
                            LIMIT 1
                        );
                        
                        INSERT INTO tbl_messages_head_logs(sent_at, sender_id, receiver_id)
                        SELECT sent_at, sender_id, receiver_id
                        FROM tbl_messages 
                        WHERE id = @head;
                        
                        SET @head_id = (SELECT LAST_INSERT_ID());
                        
                        INSERT INTO tbl_messages_logs(
                        head_id, sent_at, content_text, content_file, content, 
                        sender_id, receiver_id, content_seen
                        )
                        SELECT @head_id, t1.sent_at, t1.content_text, t1.content_file, 
                            t1.content, t1.sender_id, t1.receiver_id, t1.content_seen
                        FROM tbl_messages AS t1
                        JOIN temp_selected_messages_id AS t2
                        ON t1.id = t2.id;
                        
                        DELETE 
                        FROM tbl_messages_head 
                        WHERE message_id = @head;
                        
                        DELETE t1
                        FROM tbl_messages t1
                        JOIN temp_selected_messages_id t2
                        ON t1.id = t2.id;

                        DROP TEMPORARY TABLE temp_selected_messages_id;

                    ELSE 
                        SELECT 'PARAMETERS DID NOT MATCH' AS ERROR;
                    END IF;
                END;

                CREATE PROCEDURE get_conversation_logs(IN in_head_id INT) 
                BEGIN
                    SELECT *
                    FROM tbl_messages_logs
                    WHERE head_id = in_head_id
                    ORDER BY sent_at DESC;
                    END;

                    CREATE PROCEDURE get_conversations_heads_logs() 
                    BEGIN
                    SELECT *
                    FROM tbl_messages_head_logs
                    ORDER BY sent_at DESC;
                END;

                CREATE PROCEDURE get_message(IN in_user VARCHAR(199), IN in_id INT)
                BEGIN

                    CALL get_user_id(in_user, @user_id);
                    SELECT @user_id;  

                    WITH tbl_selected_message AS (
                        SELECT 
                        CASE
                            WHEN sender_id != @user_id
                            THEN sender_id
                            ELSE receiver_id
                        END AS chatmate_id,
                        id,
                        sent_at,
                        content_text,
                        content_file,
                        content,
                        sender_id,
                        receiver_id,
                        content_seen
                        FROM tbl_messages
                        WHERE 
                        id = in_id
                        LIMIT 1
                    )
                    SELECT
                        t2.user,
                        t1.id,
                        t1.sent_at,
                        t1.content_text,
                        t1.content_file,
                        t1.content,
                        t1.content_seen
                    FROM tbl_selected_message AS t1
                    JOIN tbl_users AS t2
                        ON t1.chatmate_id = t2.id;
                END;

                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 5 SECOND), 1, 0, '1 HELLO WORLD!', 'timoy', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 10 SECOND), 1, 0, '2 MERRY CHRISTMAS!', 'timoy', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 15 SECOND), 1, 0, '3 HAPPY NEW YEAR!', 'bensoy', 'timoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 20 SECOND), 1, 0, '4 PIT SENIOR!', 'bensoy', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 25 SECOND), 1, 0, '5 GOOD MORNING!', 'timoy', 'bensoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 30 SECOND), 1, 0, '6 HAPPY HOLIDAYS!', 'bensoy', 'timoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 35 SECOND), 1, 0, '7 WELCOME BACK!', 'timoy', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 40 SECOND), 1, 0, '8 CONGRATULATIONS!', 'helsi', 'bensoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 45 SECOND), 1, 0, '9 HAVE A GREAT DAY!', 'bensoy', 'timoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 50 SECOND), 1, 0, '10 GOOD NIGHT!', 'helsi', 'timoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 55 SECOND), 1, 0, '11 SEE YOU SOON!', 'timoy', 'bensoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 60 SECOND), 1, 0, '12 SAFE TRAVELS!', 'bensoy', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 65 SECOND), 1, 0, '13 STAY STRONG!', 'helsi', 'timoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 70 SECOND), 1, 0, '14 THANK YOU!', 'timoy', 'bensoy');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 75 SECOND), 1, 0, '15 C', 'helsi', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 80 SECOND), 1, 0, '16 C++', 'helsi', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 85 SECOND), 1, 0, '17 C#', 'helsi', 'helsi');
                CALL insert_message(DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 90 SECOND), 1, 0, '18 Java', 'helsi', 'helsi');
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS tbl_messages_logs;
                DROP TABLE IF EXISTS tbl_messages_head_logs;
                DROP TABLE IF EXISTS tbl_messages_head;
                DROP TABLE IF EXISTS tbl_messages;
                DROP TABLE IF EXISTS tbl_users;
                DROP PROCEDURE IF EXISTS get_user_id;
                DROP PROCEDURE IF EXISTS insert_message;
                DROP PROCEDURE IF EXISTS get_conversations_heads;
                DROP PROCEDURE IF EXISTS get_conversation;
                DROP PROCEDURE IF EXISTS relocate_conversation_to_logs;
                DROP PROCEDURE IF EXISTS get_conversation_logs;
                DROP PROCEDURE IF EXISTS get_conversations_heads_logs;
            ");
        }
    }

}
