#!/usr/bin/env python

"""
    Reads from temp file and sends coordinates over websocket
"""

import sys
import time

while True:
    with open("temp.txt", "r") as f:
        coordinates = f.readline().replace("\n","")
        print coordinates
        sys.stdout.flush()

    time.sleep(0.5)
