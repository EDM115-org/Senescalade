FROM archlinux:latest

ARG TOKEN
RUN pacman -Syyu --noconfirm && \
    pacman -S --noconfirm python-pip git && \
    pacman -Scc --noconfirm
RUN python -m venv /venv && \
    . /venv/bin/activate && \
    pip install -U pip setuptools wheel
ENV PATH="/venv/bin:$PATH"
WORKDIR /app
RUN git clone https://$TOKEN@github.com/EDM115-org/Tab-Magiques.git . && \
    pip install -U -r /app/senescalade/requirements.txt
CMD ["bash", "start.sh"]
