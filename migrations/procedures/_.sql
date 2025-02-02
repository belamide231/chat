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









{

  -- FOR URL GENERATION
  set APP_KEY=tz60lnca9m7pr1i
  set REDIRECT_URI=http://localhost
  set STATE=12345
  echo "https://www.dropbox.com/oauth2/authorize?client_id=%APP_KEY%&response_type=code&token_access_type=offline&redirect_uri=%REDIRECT_URI%&state=%STATE%"

  -- AFTER ECHOING YOU GET THIS
  -- OUTPUT EXAMPLE: "https://www.dropbox.com/oauth2/authorize?client_id=tz60lnca9m7pr1i&response_type=code&token_access_type=offline&redirect_uri=http://localhost&state=12345"
  -- THEN BROWSE THE OUTPUT

  -- TO GET THIS URL
  http://localhost/?code=cwVhGKw-8PoAAAAAAAAAY0M4cD4RFhxOQ2Y-_uJkIRU&state=12345

  -- THEN TAKE THE CODE AS QUERY
  cwVhGKw-8PoAAAAAAAAAY0M4cD4RFhxOQ2Y-_uJkIRU

  -- THEN SET IT IN THE AUTHORIZATION
  set AUTHORIZATION_CODE=cwVhGKw-8PoAAAAAAAAAY0M4cD4RFhxOQ2Y-_uJkIRU
  set APP_SECRET=j8bxoeqyz2y2d6g

  -- THEN FETCH THIS
  curl -X POST https://api.dropbox.com/oauth2/token ^
  -d code=%AUTHORIZATION_CODE% ^
  -d grant_type=authorization_code ^
  -d client_id=%APP_KEY% ^
  -d client_secret=%APP_SECRET% ^
  -d redirect_uri=%REDIRECT_URI%
  -- AND AFTHER THAT TAKE THE ACCESS_TOKEN
  
  -- THEN TAKE THE REFRESH TOKEN OF THE OUTPUT AND SET IT IN HERE
  set REFRESH_TOKEN=tXO5C6ech_IAAAAAAAAAAV8Q6FiMnb-ZoQ2EkhnB-0t2wht0QPMpb6EOJVqfM15T
  curl -X POST https://api.dropbox.com/oauth2/token ^
  -d refresh_token=%REFRESH_TOKEN% ^
  -d grant_type=refresh_token ^
  -d client_id=%APP_KEY% ^
  -d client_secret=%APP_SECRET%

}