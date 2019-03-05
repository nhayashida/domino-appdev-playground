import { Button, TextArea } from 'carbon-components-react';
import { fromPairs } from 'lodash';
import React, { ChangeEvent, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import actions from '../actions/actions';
import { DOMINO_API_PROPERTIES } from '../../../common/utils/constants';

type Props = {
  selectedApi: string;
  execute: (method: string, options: object) => void;
};

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

// tslint:disable-next-line: variable-name
const InputForm = (props: Props): JSX.Element => {
  const { selectedApi, execute } = props;
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
    execute(selectedApi, options);
  };

  const apiProps = DOMINO_API_PROPERTIES.find(props => props.api === selectedApi);
  const inputFields = apiProps
    ? Object.keys(apiProps.options).map((key, i) => (
        <TextArea
          key={i}
          id={key}
          className="input-field"
          labelText={key}
          placeholder={apiProps.options[key].placeholder}
          rows={1}
          onChange={onInputFieldChange}
        />
      ))
    : undefined;
  return (
    <div>
      <div className="input-fields" ref={inputFieldsRef}>
        {inputFields}
      </div>
      <Button onClick={onExecute}>Execute</Button>
    </div>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(InputForm);
