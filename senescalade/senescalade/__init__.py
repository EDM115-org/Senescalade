import logging
import pymysql

LOG_HEADERS = False

LOG_POST = True

pymysql.install_as_MySQLdb()

class LoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.logger = logging.getLogger(__name__)

    def __call__(self, request):
        response = self.get_response(request)
        if LOG_POST and request.method == 'POST':
            self.log_post_data(request)
        if LOG_HEADERS:
            self.log_request_headers(request)
        return response

    def log_request_headers(self, request):
        headers = {k: v for k, v in request.headers.items()}
        self.logger.info(f"Request Headers : {headers}")

    def log_post_data(self, request):
        post_data = {k: v for k, v in request.POST.items()}
        self.logger.info(f"POST Data : {post_data}")
