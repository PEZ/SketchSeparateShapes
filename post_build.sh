#!/usr/bin/env bash

RESOURCES_SRC_DIR='resources'
PLUGIN_DIR=$(node << EOF
    dict = $(<package.json);
    console.log(dict.skpm.main);
EOF
)

RESOURCES_DIR="${PLUGIN_DIR}/Contents/Resources/"

mkdir -p ${RESOURCES_DIR}
cp -a "${RESOURCES_SRC_DIR}"/* ${RESOURCES_DIR}