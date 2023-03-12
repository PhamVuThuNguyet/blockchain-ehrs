#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/neuralmed.com/orderers/orderer.neuralmed.com/msp/tlscacerts/tlsca.neuralmed.com-cert.pem
PEER0_HOSP1_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hosp1.neuralmed.com/peers/peer0.hosp1.neuralmed.com/tls/ca.crt
PEER0_HOSP2_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hosp2.neuralmed.com/peers/peer0.hosp2.neuralmed.com/tls/ca.crt
PEER0_HOSP3_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hosp3.neuralmed.com/peers/peer0.hosp3.neuralmed.com/tls/ca.crt

# Set OrdererOrg.Admin globals
setOrdererGlobals() {
  CORE_PEER_LOCALMSPID="OrdererMSP"
  CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/neuralmed.com/orderers/orderer.neuralmed.com/msp/tlscacerts/tlsca.neuralmed.com-cert.pem
  CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/ordererOrganizations/neuralmed.com/users/Admin@neuralmed.com/msp
}

# Set environment variables for the peer org
setGlobals() {
  ORG=$1
  if [ $ORG -eq 1 ]; then
    CORE_PEER_LOCALMSPID="hosp1MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSP1_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hosp1.neuralmed.com/users/Admin@hosp1.neuralmed.com/msp
    CORE_PEER_ADDRESS=peer0.hosp1.neuralmed.com:7051
  elif [ $ORG -eq 2 ]; then
    CORE_PEER_LOCALMSPID="hosp2MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSP2_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hosp2.neuralmed.com/users/Admin@hosp2.neuralmed.com/msp
    CORE_PEER_ADDRESS=peer0.hosp2.neuralmed.com:9051
  elif [ $ORG -eq 3 ]; then
    CORE_PEER_LOCALMSPID="hosp3MSP"
    CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HOSP3_CA
    CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/organizations/peerOrganizations/hosp3.neuralmed.com/users/Admin@hosp3.neuralmed.com/msp
    CORE_PEER_ADDRESS=peer0.hosp3.neuralmed.com:11051
  else
    echo "================== ERROR !!! ORG Unknown =================="
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

verifyResult() {
  if [ $1 -ne 0 ]; then
    echo $'\e[1;31m'!!!!!!!!!!!!!!! $2 !!!!!!!!!!!!!!!!$'\e[0m'
    echo
    exit 1
  fi
}
