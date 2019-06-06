import Button from 'carbon-components-react/lib/components/Button';
import TextArea from 'carbon-components-react/lib/components/TextArea';
import fromPairs from 'lodash/fromPairs';
import React, { ChangeEvent, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { executeApi } from '../reducers/thunkActions';
import { DOMINO_API_PROPERTIES } from '../../../common/utils/constants';

interface Props {
  selectedApi: string;
  executeApi: typeof executeApi;
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ executeApi }, dispatch);

// tslint:disable-next-line: variable-name
const InputForm = (props: Props): JSX.Element => {
  const { selectedApi } = props;
  const inputFieldsRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    // Clear input fields if selected api is changed
    getInputFields().forEach(input => {
      input.value = '';
      input.style.height = 'auto';
    });
  }, [selectedApi]);

  const getInputFields = (): HTMLTextAreaElement[] => {
    const elem = inputFieldsRef.current;
    if (!elem) {
      return [];
    }
    return Array.from(elem.querySelectorAll('textarea'));
  };

  const onInputFieldChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    // Resize textarea
    const { currentTarget: elem } = e;
    elem.style.height = `auto`;
    elem.style.height = `${elem.scrollHeight + 1}px`;
  };

  const onExecute = () => {
    const options = fromPairs(
      getInputFields().map(input => {
        const { id, value } = input;
        try {
          return [id, JSON.parse(value)];
        } catch (err) {
          // An error is thrown if the type of the value is string.
          // Then, use the value as is.
          return [id, value];
        }
      }),
    );
    props.executeApi(selectedApi, options);
  };

  const apiProps = DOMINO_API_PROPERTIES.find(props => props.api === selectedApi);
  const inputFields = apiProps
    ? apiProps.options.map((option, i) => (
        <TextArea
          key={i}
          id={option.id}
          className="input-field"
          labelText={option.id}
          placeholder={option.placeholder}
          rows={1}
          onChange={onInputFieldChange}
        />
      ))
    : undefined;
  return (
    <Fragment>
      <div className="input-fields" ref={inputFieldsRef}>
        {inputFields}
      </div>
      <Button onClick={onExecute}>Execute</Button>
    </Fragment>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(InputForm);
