FROM python:3.10

RUN apt-get update && apt-get install -y wget unzip \
    && wget https://releases.hashicorp.com/terraform/1.6.6/terraform_1.6.6_linux_amd64.zip \
    && unzip terraform_1.6.6_linux_amd64.zip \
    && mv terraform /usr/local/bin/ \
    && rm terraform_1.6.6_linux_amd64.zip

WORKDIR /app

COPY backend/ backend/
COPY terraform/ terraform/

RUN pip install -r backend/requirements.txt

WORKDIR /app/backend

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

