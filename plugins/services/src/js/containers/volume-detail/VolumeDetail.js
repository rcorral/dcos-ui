import classNames from "classnames";
import React from "react";
import { Link } from "react-router";

import Breadcrumb from "#SRC/js/components/Breadcrumb";
import BreadcrumbTextContent from "#SRC/js/components/BreadcrumbTextContent";
import ConfigurationMap from "#SRC/js/components/ConfigurationMap";
import ConfigurationMapLabel from "#SRC/js/components/ConfigurationMapLabel";
import ConfigurationMapRow from "#SRC/js/components/ConfigurationMapRow";
import ConfigurationMapSection
  from "#SRC/js/components/ConfigurationMapSection";
import ConfigurationMapValue from "#SRC/js/components/ConfigurationMapValue";
import DetailViewHeader from "#SRC/js/components/DetailViewHeader";
import Page from "#SRC/js/components/Page";
import ServiceBreadcrumbs from "../../components/ServiceBreadcrumbs";
import VolumeStatus from "../../constants/VolumeStatus";

class VolumeDetail extends React.Component {
  getSizeLabel() {
    if (this.props.volume.type === "External") {
      return "Size (GiB)";
    }

    return "Size (MiB)";
  }

  renderSubHeader() {
    const { volume } = this.props;

    const status = volume.getStatus();
    const classes = classNames({
      "text-danger": status === VolumeStatus.DETACHED,
      "text-success": status === VolumeStatus.ATTACHED
    });

    return <span className={classes}>{status}</span>;
  }

  render() {
    const { service, volume } = this.props;

    const serviceID = service.getId();
    const encodedServiceId = encodeURIComponent(serviceID);
    const volumeId = volume.getId();

    const extraCrumbs = [
      <Breadcrumb key={-1} title="Services">
        <BreadcrumbTextContent>
          <Link
            to={`/services/detail/${encodedServiceId}/volumes/${volumeId}`}
            key="volume"
          >

            {volumeId}
          </Link>
        </BreadcrumbTextContent>
      </Breadcrumb>
    ];

    const breadcrumbs = (
      <ServiceBreadcrumbs serviceID={serviceID} extra={extraCrumbs} />
    );

    return (
      <Page>
        <Page.Header breadcrumbs={breadcrumbs} />
        <DetailViewHeader subTitle={this.renderSubHeader()} title={volumeId} />
        <ConfigurationMap>
          <ConfigurationMapSection>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                Container Path
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {volume.getContainerPath()}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                Mode
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {volume.getMode()}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                {this.getSizeLabel()}
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {volume.getSize()}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                Application
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {serviceID}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                Task ID
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {volume.getTaskID()}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
            <ConfigurationMapRow>
              <ConfigurationMapLabel>
                Host
              </ConfigurationMapLabel>
              <ConfigurationMapValue>
                {volume.getHost()}
              </ConfigurationMapValue>
            </ConfigurationMapRow>
          </ConfigurationMapSection>
        </ConfigurationMap>
      </Page>
    );
  }
}

VolumeDetail.propTypes = {
  service: React.PropTypes.object.isRequired,
  volume: React.PropTypes.object.isRequired
};

module.exports = VolumeDetail;
