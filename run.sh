#!/bin/bash

FUNCTION_NAME="SerbetBlockchain"

sam build && clear && sam local invoke -e events/clear-event.json $FUNCTION_NAME --log-file logfile.txt &&  tr '\r' '\n' <logfile.txt && cat logfile.txt
