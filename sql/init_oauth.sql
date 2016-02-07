CREATE TABLE `user` (
  `id` bigint(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(300) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(300) NOT NULL,
  `creation_date` datetime NOT NULL,
  `last_login_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `app_client` (
  `client_id` varchar(100) NOT NULL,
  `client_secret` varchar(500) NOT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `app_token` (
  `access_token` varchar(200) NOT NULL,
  `user_id` bigint(11) unsigned NOT NULL,
  `client_id` varchar(100) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `created` datetime NOT NULL,
  PRIMARY KEY (`access_token`),
  KEY `FK_client` (`client_id`),
  KEY `FK_user` (`user_id`),
  CONSTRAINT `FK_client` FOREIGN KEY (`client_id`) REFERENCES `app_client` (`client_id`),
  CONSTRAINT `FK_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;