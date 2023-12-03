FROM archlinux:base

RUN pacman -Syyu --noconfirm && \
    pacman -S --noconfirm python-pip git mysql apache && \
    pacman -Scc --noconfirm
RUN python -m venv /venv && \
    . /venv/bin/activate && \
    pip install --no-cache-dir -U pip==23.3.1 setuptools==69.0.2 wheel==0.42.0
ENV PATH="/venv/bin:$PATH"
WORKDIR /app
RUN git clone https://github.com/EDM115-org/Tab-Magiques.git . && \
    pip install --no-cache-dir -U -r /app/requirements.txt
COPY apache.conf /etc/httpd/conf/extra/httpd.conf
COPY .env /app/
RUN echo "Include conf/extra/httpd.conf" >> /etc/httpd/conf/httpd.conf
EXPOSE 80
CMD ["bash", "-c", "httpd -DFOREGROUND & bash start.sh"]
