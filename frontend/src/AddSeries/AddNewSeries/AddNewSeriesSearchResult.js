import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'Components/Icon';
import Label from 'Components/Label';
import Link from 'Components/Link/Link';
import MetadataAttribution from 'Components/MetadataAttribution';
import { icons, kinds, sizes } from 'Helpers/Props';
import SeriesPoster from 'Series/SeriesPoster';
import translate from 'Utilities/String/translate';
import AddNewSeriesModal from './AddNewSeriesModal';
import styles from './AddNewSeriesSearchResult.css';

class AddNewSeriesSearchResult extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this.state = {
      isNewAddSeriesModalOpen: false
    };
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isExistingSeries && this.props.isExistingSeries) {
      this.onAddSeriesModalClose();
    }
  }

  //
  // Listeners

  onPress = () => {
    this.setState({ isNewAddSeriesModalOpen: true });
  };

  onAddSeriesModalClose = () => {
    this.setState({ isNewAddSeriesModalOpen: false });
  };

  onTVDBLinkPress = (event) => {
    event.stopPropagation();
  };

  //
  // Render

  render() {
    const {
      tvdbId,
      title,
      titleSlug,
      year,
      network,
      status,
      overview,
      folder,
      images,
      isExistingSeries,
      isSmallScreen,
      safeForWorkMode
    } = this.props;

    const {
      isNewAddSeriesModalOpen
    } = this.state;

    const linkProps = isExistingSeries ? { to: `/site/${titleSlug}` } : { onPress: this.onPress };

    return (
      <div className={styles.searchResult}>
        <Link
          className={styles.underlay}
          {...linkProps}
        />

        <div className={styles.overlay}>
          {
            isSmallScreen ?
              null :
              <SeriesPoster
                className={styles.poster}
                images={images}
                blur={safeForWorkMode}
                size={250}
                overflow={true}
                lazy={false}
              />
          }

          <div className={styles.content}>
            <div className={styles.titleRow}>
              <div className={styles.titleContainer}>
                <div className={styles.title}>
                  {title}
                </div>
              </div>

              <div className={styles.icons}>
                {
                  isExistingSeries ?
                    <Icon
                      className={styles.alreadyExistsIcon}
                      name={icons.CHECK_CIRCLE}
                      size={36}
                      title={translate('AlreadyInYourLibrary')}
                    /> :
                    null
                }

                <Link
                  className={styles.tvdbLink}
                  to={`https://metadataapi.net/sites/${tvdbId}`}
                  onPress={this.onTVDBLinkPress}
                >
                  <Icon
                    className={styles.tvdbLinkIcon}
                    name={icons.EXTERNAL_LINK}
                    size={28}
                  />
                </Link>
              </div>
            </div>

            <div>

              {
                network ?
                  <Label size={sizes.LARGE}>
                    {network}
                  </Label> :
                  null
              }

              {
                status === 'ended' ?
                  <Label
                    kind={kinds.DANGER}
                    size={sizes.LARGE}
                  >
                    {translate('Ended')}
                  </Label> :
                  null
              }

              {
                status === 'upcoming' ?
                  <Label
                    kind={kinds.INFO}
                    size={sizes.LARGE}
                  >
                    {translate('Upcoming')}
                  </Label> :
                  null
              }
            </div>

            <div className={styles.overview}>
              {overview}
            </div>

            <MetadataAttribution />
          </div>
        </div>

        <AddNewSeriesModal
          isOpen={isNewAddSeriesModalOpen && !isExistingSeries}
          tvdbId={tvdbId}
          title={title}
          year={year}
          overview={overview}
          folder={folder}
          images={images}
          onModalClose={this.onAddSeriesModalClose}
        />
      </div>
    );
  }
}

AddNewSeriesSearchResult.propTypes = {
  tvdbId: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  titleSlug: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  network: PropTypes.string,
  status: PropTypes.string.isRequired,
  overview: PropTypes.string,
  folder: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  isExistingSeries: PropTypes.bool.isRequired,
  isSmallScreen: PropTypes.bool.isRequired,
  safeForWorkMode: PropTypes.bool
};

export default AddNewSeriesSearchResult;
