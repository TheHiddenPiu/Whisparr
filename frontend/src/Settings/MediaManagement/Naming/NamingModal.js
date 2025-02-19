import PropTypes from 'prop-types';
import React, { Component } from 'react';
import FieldSet from 'Components/FieldSet';
import SelectInput from 'Components/Form/SelectInput';
import TextInput from 'Components/Form/TextInput';
import Icon from 'Components/Icon';
import Button from 'Components/Link/Button';
import InlineMarkdown from 'Components/Markdown/InlineMarkdown';
import Modal from 'Components/Modal/Modal';
import ModalBody from 'Components/Modal/ModalBody';
import ModalContent from 'Components/Modal/ModalContent';
import ModalFooter from 'Components/Modal/ModalFooter';
import ModalHeader from 'Components/Modal/ModalHeader';
import { icons, sizes } from 'Helpers/Props';
import translate from 'Utilities/String/translate';
import NamingOption from './NamingOption';
import styles from './NamingModal.css';

const separatorOptions = [
  {
    key: ' ',
    get value() {
      return `${translate('Space')} ( )`;
    }
  },
  {
    key: '.',
    get value() {
      return `${translate('Period')} (.)`;
    }
  },
  {
    key: '_',
    get value() {
      return `${translate('Underscore')} (_)`;
    }
  },
  {
    key: '-',
    get value() {
      return `${translate('Dash')} (-)`;
    }
  }
];

const caseOptions = [
  {
    key: 'title',
    get value() {
      return translate('DefaultCase');
    }
  },
  {
    key: 'lower',
    get value() {
      return translate('Lowercase');
    }
  },
  {
    key: 'upper',
    get value() {
      return translate('Uppercase');
    }
  }
];

const fileNameTokens = [
  {
    token: '{Site Title} - S{season:00}E{episode:00} - {Episode Title} {Quality Full}',
    example: 'Site Title (2010) - S01E01 - Episode Title HDTV-720p Proper'
  },
  {
    token: '{Site Title} - {season:0}x{episode:00} - {Episode Title} {Quality Full}',
    example: 'Site Title (2010) - 1x01 - Episode Title HDTV-720p Proper'
  },
  {
    token: '{Site.Title}.S{season:00}E{episode:00}.{EpisodeClean.Title}.{Quality.Full}',
    example: 'Site.Title.(2010).S01E01.Episode.Title.HDTV-720p'
  }
];

const seriesTokens = [
  { token: '{Site Title}', example: 'Site Title\'s' },
  { token: '{Site TitleSlug}', example: 'SiteTitle\'s' },
  { token: '{Site CleanTitle}', example: 'Site Titles' },
  { token: '{Site CleanTitleYear}', example: 'Site Titles! 2010' },
  { token: '{Site CleanTitleWithoutYear}', example: 'Site Titles!' },
  { token: '{Site TitleThe}', example: 'Site Title\'s, The' },
  { token: '{Site TitleTheYear}', example: 'Site Title\'s, The (2010)' },
  { token: '{Site TitleTheWithoutYear}', example: 'Site Title\'s, The' },
  { token: '{Site TitleYear}', example: 'Site Title\'s (2010)' },
  { token: '{Site TitleWithoutYear}', example: 'Site Title\'s' },
  { token: '{Site TitleFirstCharacter}', example: 'S' },
  { token: '{Site Year}', example: '2010' },
  { token: '{Site Network}', example: 'Site Network' }
];

const seriesIdTokens = [
  { token: '{tpdbId}', example: '12345' }
];

const airDateTokens = [
  { token: '{Release-Date}', example: '2016-03-20' },
  { token: '{Release Date}', example: '2016 03 20' },
  { token: '{Episode Year}', example: '2016' }
];

const episodeTitleTokens = [
  { token: '{Episode Title}', example: 'Episode\'s Title' },
  { token: '{Episode CleanTitle}', example: 'Episodes Title' },
  { token: '{Episode Performers}', example: 'Lola Luv Brad Harden' },
  { token: '{Episode PerformersFemale}', example: 'Lola Luv' },
  { token: '{Episode PerformersMale}', example: 'Brad Harden' }
];

const qualityTokens = [
  { token: '{Quality Full}', example: 'HDTV-720p Proper' },
  { token: '{Quality Title}', example: 'HDTV-720p' }
];

const mediaInfoTokens = [
  { token: '{MediaInfo Simple}', example: 'x264 DTS' },
  { token: '{MediaInfo Full}', example: 'x264 DTS [EN+DE]', footNote: 1 },

  { token: '{MediaInfo AudioCodec}', example: 'DTS' },
  { token: '{MediaInfo AudioChannels}', example: '5.1' },
  { token: '{MediaInfo AudioLanguages}', example: '[EN+DE]', footNote: 1 },
  { token: '{MediaInfo SubtitleLanguages}', example: '[DE]', footNote: 1 },

  { token: '{MediaInfo VideoCodec}', example: 'x264' },
  { token: '{MediaInfo VideoBitDepth}', example: '10' },
  { token: '{MediaInfo VideoDynamicRange}', example: 'HDR' },
  { token: '{MediaInfo VideoDynamicRangeType}', example: 'DV HDR10' }
];

const otherTokens = [
  { token: '{Release Group}', example: 'Rls Grp' },
  { token: '{Custom Formats}', example: 'iNTERNAL' }
];

const originalTokens = [
  { token: '{Original Title}', example: 'Series.Title.S01E01.HDTV.x264-EVOLVE' },
  { token: '{Original Filename}', example: 'series.title.s01e01.hdtv.x264-EVOLVE' }
];

class NamingModal extends Component {

  //
  // Lifecycle

  constructor(props, context) {
    super(props, context);

    this._selectionStart = null;
    this._selectionEnd = null;

    this.state = {
      separator: ' ',
      case: 'title'
    };
  }

  //
  // Listeners

  onTokenSeparatorChange = (event) => {
    this.setState({ separator: event.value });
  };

  onTokenCaseChange = (event) => {
    this.setState({ case: event.value });
  };

  onInputSelectionChange = (selectionStart, selectionEnd) => {
    this._selectionStart = selectionStart;
    this._selectionEnd = selectionEnd;
  };

  onOptionPress = ({ isFullFilename, tokenValue }) => {
    const {
      name,
      value,
      onInputChange
    } = this.props;

    const selectionStart = this._selectionStart;
    const selectionEnd = this._selectionEnd;

    if (isFullFilename) {
      onInputChange({ name, value: tokenValue });
    } else if (selectionStart == null) {
      onInputChange({
        name,
        value: `${value}${tokenValue}`
      });
    } else {
      const start = value.substring(0, selectionStart);
      const end = value.substring(selectionEnd);
      const newValue = `${start}${tokenValue}${end}`;

      onInputChange({ name, value: newValue });
      this._selectionStart = newValue.length - 1;
      this._selectionEnd = newValue.length - 1;
    }
  };

  //
  // Render

  render() {
    const {
      name,
      value,
      isOpen,
      advancedSettings,
      episode,
      additional,
      onInputChange,
      onModalClose
    } = this.props;

    const {
      separator: tokenSeparator,
      case: tokenCase
    } = this.state;

    return (
      <Modal
        isOpen={isOpen}
        onModalClose={onModalClose}
      >
        <ModalContent onModalClose={onModalClose}>
          <ModalHeader>
            {translate('FileNameTokens')}
          </ModalHeader>

          <ModalBody>
            <div className={styles.namingSelectContainer}>
              <SelectInput
                className={styles.namingSelect}
                name="separator"
                value={tokenSeparator}
                values={separatorOptions}
                onChange={this.onTokenSeparatorChange}
              />

              <SelectInput
                className={styles.namingSelect}
                name="case"
                value={tokenCase}
                values={caseOptions}
                onChange={this.onTokenCaseChange}
              />
            </div>

            {
              !advancedSettings &&
                <FieldSet legend={translate('FileNames')}>
                  <div className={styles.groups}>
                    {
                      fileNameTokens.map(({ token, example }) => {
                        return (
                          <NamingOption
                            key={token}
                            name={name}
                            value={value}
                            token={token}
                            example={example}
                            isFullFilename={true}
                            tokenSeparator={tokenSeparator}
                            tokenCase={tokenCase}
                            size={sizes.LARGE}
                            onPress={this.onOptionPress}
                          />
                        );
                      }
                      )
                    }
                  </div>
                </FieldSet>
            }

            <FieldSet legend={translate('Site')}>
              <div className={styles.groups}>
                {
                  seriesTokens.map(({ token, example }) => {
                    return (
                      <NamingOption
                        key={token}
                        name={name}
                        value={value}
                        token={token}
                        example={example}
                        tokenSeparator={tokenSeparator}
                        tokenCase={tokenCase}
                        onPress={this.onOptionPress}
                      />
                    );
                  }
                  )
                }
              </div>
            </FieldSet>

            <FieldSet legend={translate('SiteID')}>
              <div className={styles.groups}>
                {
                  seriesIdTokens.map(({ token, example }) => {
                    return (
                      <NamingOption
                        key={token}
                        name={name}
                        value={value}
                        token={token}
                        example={example}
                        tokenSeparator={tokenSeparator}
                        tokenCase={tokenCase}
                        onPress={this.onOptionPress}
                      />
                    );
                  }
                  )
                }
              </div>
            </FieldSet>

            {
              episode &&
                <div>
                  <FieldSet legend={translate('ReleaseDate')}>
                    <div className={styles.groups}>
                      {
                        airDateTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>
                </div>
            }

            {
              additional &&
                <div>
                  <FieldSet legend={translate('EpisodeTitle')}>
                    <div className={styles.groups}>
                      {
                        episodeTitleTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('Quality')}>
                    <div className={styles.groups}>
                      {
                        qualityTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('MediaInfo')}>
                    <div className={styles.groups}>
                      {
                        mediaInfoTokens.map(({ token, example, footNote }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              footNote={footNote}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>

                    <div className={styles.footNote}>
                      <Icon className={styles.icon} name={icons.FOOTNOTE} />
                      <InlineMarkdown data={translate('MediaInfoFootNote')} />
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('Other')}>
                    <div className={styles.groups}>
                      {
                        otherTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>

                  <FieldSet legend={translate('Original')}>
                    <div className={styles.groups}>
                      {
                        originalTokens.map(({ token, example }) => {
                          return (
                            <NamingOption
                              key={token}
                              name={name}
                              value={value}
                              token={token}
                              example={example}
                              tokenSeparator={tokenSeparator}
                              tokenCase={tokenCase}
                              size={sizes.LARGE}
                              onPress={this.onOptionPress}
                            />
                          );
                        }
                        )
                      }
                    </div>
                  </FieldSet>
                </div>
            }
          </ModalBody>

          <ModalFooter>
            <TextInput
              name={name}
              value={value}
              onChange={onInputChange}
              onSelectionChange={this.onInputSelectionChange}
            />
            <Button onPress={onModalClose}>
              {translate('Close')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
}

NamingModal.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  advancedSettings: PropTypes.bool.isRequired,
  season: PropTypes.bool.isRequired,
  episode: PropTypes.bool.isRequired,
  additional: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onModalClose: PropTypes.func.isRequired
};

NamingModal.defaultProps = {
  season: false,
  episode: false,
  additional: false
};

export default NamingModal;
