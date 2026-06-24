#!/bin/bash

set -e

ng build shared-utils

ng s host-app --port 4200 &
ng s home --port 4301 &
ng s search --port 4302 &
ng s categories --port 4303 &
ng s subscriptions --port 4304 &
ng s detail --port 4305 &
ng s login --port 4306 &
