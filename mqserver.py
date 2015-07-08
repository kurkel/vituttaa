import zmq
import time
import sys

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:%s" % 9090)

context2 = zmq.Context()
socket2 = context.socket(zmq.PUB)
socket2.bind("tcp://*:%s" % 9091)

while True:
    #  Wait for next request from client
    message = socket.recv()
    socket.send_string("ok")
    socket2.send_string(message)