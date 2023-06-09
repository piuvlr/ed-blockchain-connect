#!/bin/bash

EVENT=$1
FUNCTION_NAME="SerbetBlockchain"

sam build && clear && sam local invoke -e events/$EVENT.json $FUNCTION_NAME --log-file logfile.txt &&  tr '\r' '\n' <logfile.txt && cat logfile.txt
