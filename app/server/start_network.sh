#!/bin/bash
#
# Copyright Nguyetpvt
#
# SPDX-License-Identifier: Apache-2.0
#

cd ../first-network

source ./network.sh down
source ./network.sh up createChannel
source ./network.sh deployCC

cd ../server