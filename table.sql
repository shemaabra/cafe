create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(250),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(200),
    status varchar(20),
    role varchar(20),
    UNIQUE(email)
);

insert into user (name, contactNumber, email, password, status, role)values('admin', '0765904173', 'admin@gmail.com', '1223436', 'true', 'admin');