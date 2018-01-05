var VolumeDefinitions = {
  DSS: {
    name: "DC/OS Storage Service",
    type: "DC/OS",
    description: "A locally persistent volume pre-created by the operator according to a storage profile."
  },
  PERSISTENT: {
    name: "Local Persistent Volume",
    type: "Persistent",
    description: "A locally persistent volume based upon the physical disks installed in the agent which has the capabilities of a single disk."
  },
  EXTERNAL: {
    name: "External Persistent Volume",
    type: "External",
    description: "A REX-Ray backed volume that is mounted on the agent from network attached storage."
  },
  HOST: {
    name: "Host Persistent Volume",
    type: "Host",
    description: "A Host volume ...... needs copy blablabla"
  },
  EPHEMERAL: {
    name: "Ephemeral Storage",
    type: "Ephemeral",
    description: "Mesos default for allocating temporary disk space to a service. Enough for many stateless or semi-stateless 12-factor and cloud native applications."
  }
};

module.exports = VolumeDefinitions;
