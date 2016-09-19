import ServiceSpec from './ServiceSpec';
import ValidatorUtil from '../utils/ValidatorUtil';

module.exports = class PodSpec extends ServiceSpec {

  getContainers() {
    return this.get('containers') || [];
  }

  getContainerSpec(name) {
    return this.getContainers().find(function (container) {
      return container.name === name;
    });
  }

  getContainerCount() {
    return this.getContainers().length;
  }

  getEnvironment() {
    return this.get('environment') || {};
  }

  getLabels() {
    return this.get('labels') || {};
  }

  getResourcesSummary() {
    return this.getContainers().reduce(function (resources, container) {

      Object.keys(container.resources).forEach(function (key) {
        resources[key] += container.resources[key];
      });

      return resources;
    }, {
      cpus: 0,
      mem: 0,
      gpus: 0,
      disk: 0
    });
  }

  getScalingInstances() {
    let scaling = this.get('scaling') || {};
    if (!scaling.fixed) {
      return 1;
    }
    if (!ValidatorUtil.isNumber(scaling.fixed.instances)) {
      return 1;
    }
    return scaling.fixed.instances;
  }

  getVersion() {
    return this.get('version') || '';
  }

  getUser() {
    return this.get('user') || '';
  }
};
