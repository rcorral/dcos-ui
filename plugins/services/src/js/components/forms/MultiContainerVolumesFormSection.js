import { Tooltip, Select, SelectOption } from "reactjs-components";
import React, { Component } from "react";
import Objektiv from "objektiv";

import AddButton from "#SRC/js/components/form/AddButton";
import FieldAutofocus from "#SRC/js/components/form/FieldAutofocus";
import FieldError from "#SRC/js/components/form/FieldError";
import FieldInput from "#SRC/js/components/form/FieldInput";
import FieldLabel from "#SRC/js/components/form/FieldLabel";
import FormGroup from "#SRC/js/components/form/FormGroup";
import FormGroupContainer from "#SRC/js/components/form/FormGroupContainer";
import FormGroupHeading from "#SRC/js/components/form/FormGroupHeading";
import FormGroupHeadingContent
  from "#SRC/js/components/form/FormGroupHeadingContent";
import FormRow from "#SRC/js/components/form/FormRow";
import Icon from "#SRC/js/components/Icon";
import MetadataStore from "#SRC/js/stores/MetadataStore";

import VolumeDefinitions
  from "#PLUGINS/services/src/js/constants/VolumeDefinitions";

import { getContainerNameWithIcon } from "../../utils/ServiceConfigDisplayUtil";
import {
  FormReducer as volumeMounts
} from "../../reducers/serviceForm/MultiContainerVolumes";
import VolumeConstants from "../../constants/VolumeConstants";

const errorsLens = Objektiv.attr("container", {}).attr("volumes", []);
const excludedTypes = ["DSS", "EXTERNAL"];

class MultiContainerVolumesFormSection extends Component {
  getContainerMounts(containers, volumeMountIndex) {
    const { volumeMounts } = this.props.data;

    return containers.map((container, containerIndex) => {
      let containersLabel = null;
      let pathLabel = null;
      if (containerIndex === 0) {
        containersLabel = (
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                Containers
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
        );
        pathLabel = (
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                Container Path
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
        );
      }

      return (
        <FormRow key={containerIndex}>
          <FormGroup className="column-3">
            {containersLabel}
            <div className="form-control-input-height">
              {getContainerNameWithIcon(container)}
            </div>
          </FormGroup>
          <FormGroup className="column-9">
            {pathLabel}
            <FieldInput
              name={`volumeMounts.${volumeMountIndex}.mountPath.${containerIndex}`}
              type="text"
              value={volumeMounts[volumeMountIndex].mountPath[containerIndex]}
            />
          </FormGroup>
        </FormRow>
      );
    });
  }

  /**
   * getExternalVolumesLines
   *
   * @param  {Object} data
   * @param  {Number} offset as we have two independent sections that are 0
   *   based we need to add an offset to the second one
   * @return {Array} elements
   */
  getVolumesMountLines(data, offset) {
    const { containers } = this.props.data;

    return data.map((volumes, key) => {
      const nameError = errorsLens
        .at(key + offset, {})
        .attr("volumes", {})
        .get(this.props.errors).name;
      const removeHandler = this.props.onRemoveItem.bind(this, {
        value: key,
        path: "volumeMounts"
      });

      if (volumes.type === VolumeConstants.type.unknown) {
        return null;
      }

      return (
        <FormGroupContainer onRemove={removeHandler} key={key}>
          <FormRow>
            <FormGroup className="column-6" showError={false}>
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    Volume Type
                  </FormGroupHeadingContent>
                </FormGroupHeading>
              </FieldLabel>
              <Select
                name={`volumeMounts.${key}.type`}
                value={volumes.type}
                placeholder="Select ..."
              >
                {Object.keys(VolumeDefinitions)
                  .filter(type => !excludedTypes.includes(type))
                  .map((type, index) => {
                    return (
                      <SelectOption
                        key={index}
                        value={type}
                        label={VolumeDefinitions[type].type}
                      >
                        <span className="dropdown-select-item-title">
                          {VolumeDefinitions[type].name}
                        </span>
                        <span className="dropdown-select-item-description">
                          {VolumeDefinitions[type].description}
                        </span>
                      </SelectOption>
                    );
                  })}
              </Select>
            </FormGroup>
            <FormGroup className="column-6" showError={Boolean(nameError)}>
              <FieldLabel>
                <FormGroupHeading>
                  <FormGroupHeadingContent primary={true}>
                    Name
                  </FormGroupHeadingContent>
                </FormGroupHeading>
              </FieldLabel>
              <FieldInput
                name={`volumeMounts.${key}.name`}
                type="text"
                value={volumes.name}
              />
              <FieldError>{nameError}</FieldError>
            </FormGroup>
          </FormRow>
          {this.getHostPathInput(volumes, key)}
          {this.getLocalPersistentInput(volumes, key)}
          {this.getContainerMounts(containers, key)}
        </FormGroupContainer>
      );
    });
  }

  getHostPathInput(volumes, key) {
    if (volumes.type === VolumeConstants.type.host) {
      return (
        <FormRow>
          <FormGroup className="column-12">
            <FieldLabel>
              <FormGroupHeading>
                <FormGroupHeadingContent primary={true}>
                  Host Path
                </FormGroupHeadingContent>
              </FormGroupHeading>
            </FieldLabel>
            <FieldAutofocus>
              <FieldInput
                name={`volumeMounts.${key}.hostPath`}
                type="text"
                value={volumes.hostPath}
              />
            </FieldAutofocus>
          </FormGroup>
        </FormRow>
      );
    }
  }

  getLocalPersistentInput(volumes, key) {
    if (volumes.type !== VolumeConstants.type.localPersistent) {
      return null;
    }

    return (
      <FormRow>
        <FormGroup className="column-3">
          <FieldLabel>
            <FormGroupHeading>
              <FormGroupHeadingContent primary={true}>
                Size (GiB)
              </FormGroupHeadingContent>
            </FormGroupHeading>
          </FieldLabel>
          <FieldAutofocus>
            <FieldInput
              name={`volumeMounts.${key}.size`}
              type="number"
              value={volumes.size}
            />
          </FieldAutofocus>
        </FormGroup>
      </FormRow>
    );
  }

  getHeadline() {
    const tooltipContent = (
      <span>
        {"DC/OS offers several storage options. "}
        <a href={MetadataStore.buildDocsURI("/usage/storage/")} target="_blank">
          More information
        </a>.
      </span>
    );

    return (
      <h2 className="flush-top short-bottom">
        <FormGroupHeading>
          <FormGroupHeadingContent primary={true}>
            Volumes
          </FormGroupHeadingContent>
          <FormGroupHeadingContent>
            <Tooltip
              content={tooltipContent}
              interactive={true}
              maxWidth={300}
              wrapText={true}
            >
              <Icon color="grey" id="circle-question" size="mini" />
            </Tooltip>
          </FormGroupHeadingContent>
        </FormGroupHeading>
      </h2>
    );
  }

  render() {
    const { data, handleTabChange } = this.props;

    if (!data.containers || !data.containers.length) {
      return (
        <div>
          {this.getHeadline()}
          <p>
            {"Please "}
            <a
              onClick={handleTabChange.bind(null, "services")}
              className="clickable"
            >
              add a container
            </a>
            {" before configuring Volumes."}
          </p>
        </div>
      );
    }

    return (
      <div>
        {this.getHeadline()}
        <p>
          Create a stateful service by configuring a persistent volume. Persistent volumes enable instances to be restarted without data loss.
        </p>
        {this.getVolumesMountLines(data.volumeMounts, data.volumeMounts)}
        <div>
          <AddButton
            onClick={this.props.onAddItem.bind(this, {
              path: "volumeMounts"
            })}
          >
            Add Volume
          </AddButton>
        </div>
      </div>
    );
  }
}

MultiContainerVolumesFormSection.defaultProps = {
  data: {},
  errors: {},
  handleTabChange() {},
  onAddItem() {},
  onRemoveItem() {}
};

MultiContainerVolumesFormSection.propTypes = {
  data: React.PropTypes.object,
  errors: React.PropTypes.object,
  handleTabChange: React.PropTypes.func,
  onAddItem: React.PropTypes.func,
  onRemoveItem: React.PropTypes.func
};

MultiContainerVolumesFormSection.configReducers = {
  volumeMounts
};

module.exports = MultiContainerVolumesFormSection;
