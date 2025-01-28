create database bills;

use bills;

create table ano (
    cod int not NULL auto_increment,
    descricao varchar (50),
    primary key (cod)
);

insert into ano (descricao) values
    ('2024'),
    ('2025'),
    ('2026');


create table mes(
    cod int not null auto_increment,
    descricao varchar (50),
    primary key (cod)
);


insert into mes (descricao) values
    ('Janeiro'),
    ('Fevereiro'),
    ('Março'),
    ('Abril'),
    ('Maio'),
    ('Junho'),
    ('Julho'),
    ('Agosto'),
    ('Setembro'),
    ('Outubro'),
    ('Novembro'),
    ('Dezembro');


create table tipo (
	cod int not null auto_increment,
    descricao varchar (50),
    primary key (cod)
);

insert into tipo (descricao) values
    ('Eletrônicos'),
    ('Roupas'),
    ('Servicos');


create table contas (
	cod int not null auto_increment,
    nome varchar (50),
    valor decimal,
    tipo int,
    mes int,
    ano int, 
    paga boolean,
    primary key (cod),
    foreign key (ano) references ano (cod),
    foreign key (tipo) references tipo (cod),
    foreign key (mes) references mes (cod)
);