 INSERT INTO user (name, color, create_time)
 VALUES ('Henrik', 'ff0000', CURRENT_TIMESTAMP),
        ('Joel', '0000ff', CURRENT_TIMESTAMP),
        ('Fredrik', '00ff00', CURRENT_TIMESTAMP);
--
-- INSERT INTO user_position(user_id, x_pos, y_pos, updated)
-- VALUES ((SELECT id from user where name = 'Henrik'), 0, 0, CURRENT_TIMESTAMP),
--        ((SELECT id from user where name = 'Joel'), 10, 10, CURRENT_TIMESTAMP),
--        ((SELECT id from user where name = 'Fredrik'), 50, 50, CURRENT_TIMESTAMP);

