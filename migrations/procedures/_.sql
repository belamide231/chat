  CREATE PROCEDURE load_messages(IN in_message_length INT, IN in_user_id INT, IN in_chatmate_id INT)
  BEGIN
    SELECT (
      SELECT first_name FROM tbl_profiles WHERE user_id = in_chatmate_id
    ) AS chatmate, in_chatmate_id AS chatmate_id, id, sent_at, content_type, content, sender_id, (
      SELECT first_name FROM tbl_profiles WHERE user_id = sender_id
    ) AS sender, receiver_id, (
      SELECT first_name FROM tbl_profiles WHERE user_id = receiver_id
    ) AS receiver, content_seen, seen_at, company_name  
    FROM tbl_messages 
    WHERE (
      in_user_id IN(sender_id, receiver_id) AND in_chatmate_id IN(sender_id, receiver_id)
    ) ORDER BY sent_at DESC LIMIT 15 OFFSET in_message_length;
  END;;



  CREATE PROCEDURE get_chat_list(IN in_user INT)
  BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE in_chatmate_id INT;
    DECLARE cur CURSOR FOR SELECT chatmate_id FROM tbl_chatmates_id ORDER BY chatmate_id ASC;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    DROP TEMPORARY TABLE IF EXISTS tbl_chatmates_id;
    CREATE TEMPORARY TABLE tbl_chatmates_id(chatmate_id INT);
    INSERT INTO tbl_chatmates_id(chatmate_id)
    SELECT
      CASE
        WHEN sender_id != in_user THEN sender_id
        ELSE receiver_id
      END AS chatmate_id
    FROM tbl_messages_head
    WHERE in_user IN(sender_id, receiver_id)
    ORDER BY sent_at DESC LIMIT 15;
    OPEN cur;
    read_loop: LOOP
      FETCH cur INTO in_chatmate_id;
      IF done THEN
        LEAVE read_loop;
      END IF;
      CALL load_messages(0, in_user, in_chatmate_id);
    END LOOP;
    CLOSE cur;
  END;;