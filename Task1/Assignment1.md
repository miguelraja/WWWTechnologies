PART 1

A. What did the server returns?
    It returned JSON data
    
B. Where do you see the resource ID?
    In the url : post/1 and also in the response: ID: 1
    
C. Can you see the HTTP status code?
    No, because curl does not show the body, only the headers.


PART 2

D. What does 200 mean?
    The request is successful
    
E. What category of status code is it?
    It is 2xx, which means success
    
F. What other codes do you know?
    201: created; 400: bad request; 401: unauthorized; 403: forbidden; 404: not found; 500: Internal server error


PART 3

G. What would happen if Content-Type were text/html instead?
    The client would interpret the response as an HTML page instead of JSON.

H. Does the content-length match the actual size of the body?
    Yes, normally Content-Length represents the exact size in bytes of the response body.

I. Why is Connection important in high-traffic systems?
    Because keep-alive connections reuse TCP connections, reducing overhead and improving performance.


PART 4

J. What status code did you receive?
    404

K. Is there a response body?
    Yes, usually an empty object or error message

L. How does it differ from the successful case?
    No valid resources returned or indicates that the resource is not found


PART 5

M. What status code did the server return?
    201

N. What does it mean?
    Resource successfuly created

O. What headers appear in this response?
    Typical headers include: content-type, content-length, connection, sometimes location


PART 6

P. Does this API actually validate the token?
    No, the test API ignores it

Q. What status code would a real secure API return if the token were invalid?
    401 - Unauthorized

R. What is the difference between 401 and 403
    401 is unauthorized, where authentication is required or the credentials are invalid.
    403 is forbidden, where it is authenticated but it is not allowed to access the resource


PART 7

S. When would this be useful?
    When you only need metadata

T. Why might monitoring systems use this approach?
    Because it reduces bandwidth and is faster since the body is not downloaded.


PART 8

U. Complete the following table:
    201 - Success - Request successful
    400 - Client error - Bad request
    401 - Client error - Unauthorized 
    403 - Client error - Forbidden
    404 - Clien error - Resource not found
    500 - Server error - Internal server error


V. Why is it bad practice to always return 200, even on errors?
    Because clients rely on HTTP status code to detect errors. If everything returns 200, apps cannot distinguish between success and failure.
