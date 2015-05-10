"""
    Watches the webcam and streams coordinates to a socket
"""

import time
import numpy as np
import cv2

cap = cv2.VideoCapture(1)

while(True):

    ret, image = cap.read()

    orig = image.copy()
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    (minVal, maxVal, minLoc, maxLoc) = cv2.minMaxLoc(gray)

    cv2.circle(image, maxLoc, 60, (255, 0, 0), 10)

    with open("temp.txt", "w") as f:
        coordinates = "%s,%s" % maxLoc
        f.write(coordinates)

    cv2.imshow('frame',image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    time.sleep(0.5)

cap.release()
cv2.destroyAllWindows()

