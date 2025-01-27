create database bills;

use bills;

create table tipo (
	cod int not null auto_increment,
    descricao varchar (50),
    primary key (cod)
);

create table contas (
	cod int not null auto_increment,
    nome varchar (50),
    valor decimal,
    tipo int,
    desativado boolean,
    primary key (cod),
    foreign key (tipo) references tipo (cod)
);