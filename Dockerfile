FROM ubuntu:14.04

RUN apt-get update -y
RUN apt-get install -y \
  apache2 \
  rabbitmq-server \
  supervisor \
  npm \
  redis-server

RUN sed -i -e 's/#ServerName.*/ServerName localhost/' \
  /etc/apache2/sites-available/000-default.conf
RUN chown -R www-data:www-data /var/www
ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
ENV APACHE_PID_FILE /var/run/apache2/apache2.pid

RUN rm -rf /var/www/html/*
COPY \
  ChessBoard.js \
  chess.css \
  index.html \
  /var/www/html/ 

EXPOSE 80

CMD ["/usr/sbin/apache2", "-D",  "FOREGROUND"]
