CREATE TABLE tbl_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(99) UNIQUE,
    password VARCHAR(99),
    INDEX idx_user(user)
);

CREATE TABLE tbl_roles_available(
    role VARCHAR(99) PRIMARY KEY
);

INSERT INTO tbl_roles_available(role) VALUES("admin"), ("account"), ("superUser"), ("user");

CREATE TABLE tbl_roles (
    user_id int,
    company_name VARCHAR(99),
    role VARCHAR(99),
    FOREIGN KEY(role) REFERENCES tbl_roles_available(role),
    FOREIGN KEY(user_id) REFERENCES tbl_users(id)
);

CREATE TABLE tbl_profiles (
    user_id int,
    first_name VARCHAR(99),
    last_name VARCHAR(99),
    middle_name VARCHAR(99),
    email VARCHAR(99),
    phone VARCHAR(11),
    address VARCHAR(200),
    picture VARCHAR(5000),
    FOREIGN KEY(user_id) REFERENCES tbl_users(id)
);

CREATE TABLE tbl_messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    content_type VARCHAR(10),
    content VARCHAR(7999),
    sender_id INT,
    receiver_id INT,
    content_seen TINYINT DEFAULT 0,
    seen_at DATETIME DEFAULT NULL,
    company_name VARCHAR(99),
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
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
    content_type VARCHAR(10),
    content VARCHAR(7999),
    sender_id INT,
    receiver_id INT,
    content_seen TINYINT DEFAULT 0,
    seen_at DATETIME DEFAULT NULL,
    company_name VARCHAR(99),
    FOREIGN KEY(head_id) REFERENCES tbl_messages_head_logs(id),
    INDEX idx_sent_at(sent_at),
    INDEX idx_sender_id(sender_id),
    INDEX idx_receiver_id(receiver_id)
);

CREATE TABLE tbl_tickets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(50) DEFAULT "pending for agent",    
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,     
    user_id INT,                                     
    description VARCHAR(7999),                       
    review_by_agent_at DATETIME DEFAULT NULL,
    agent_id INT DEFAULT NULL,
    priority VARCHAR(10) DEFAULT NULL,                  
    issue_type VARCHAR(99) DEFAULT NULL,               
    debugging_at DATETIME DEFAULT NULL,
    developer_name VARCHAR(99) DEFAULT NULL,
    resolved_at DATETIME DEFAULT NULL,               
    FOREIGN KEY(user_id) REFERENCES tbl_users(id),
    FOREIGN KEY(agent_id) REFERENCES tbl_users(id)
);