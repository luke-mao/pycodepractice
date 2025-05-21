FROM python:3.10-slim
WORKDIR /app

# set the docker timezone to Sydney
ENV TZ=Australia/Sydney
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y tzdata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Continue with the installing of the python packages
COPY requirements.txt . 
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 9000

# Use gunicorn to serve the app in the production environment
CMD ["gunicorn", "-b", "0.0.0.0:9000", "app:app"]