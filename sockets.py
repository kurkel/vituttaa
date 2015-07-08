import asyncio
import websockets
import zmq
import time
import sys

context = zmq.Context()
socket = context.socket(zmq.SUB)
socket.connect ("tcp://localhost:%s" % 9091)

sockets = []

@asyncio.coroutine
def handler(websocket, path):
    while True:
        try:
            message = socket.recv(zmq.NOBLOCK)
            if message:
                yield from websocket.send(str(id))
                message = ""
        except:
            time.sleep(1)
            websocket.ping(1)



def broadcast(id):
    for socket in sockets:
        socket.send(str(id))

start_server = websockets.serve(handler, '0.0.0.0', 8765)

asyncio.get_event_loop().run_until_complete(start_server)
print("runnin")
asyncio.get_event_loop().run_forever()
