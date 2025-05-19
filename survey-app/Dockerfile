# Sử dụng image Python chính thức với phiên bản Python 3.12
FROM python:3.12-slim

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép file requirements.txt và cài đặt các dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Sao chép tất cả các file của ứng dụng FastAPI
COPY . .

# Mở port 8000 mà FastAPI sẽ chạy trên đó
EXPOSE 8000

# Chạy FastAPI với Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
