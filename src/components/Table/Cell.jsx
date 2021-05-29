import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ContentEditable from 'react-contenteditable';
import { usePopper } from 'react-popper';
import getIcon from '../Icons/Icons';
import { randomColor, shortId } from '../utils/ui_utils';

function Relationship({ value, backgroundColor }) {
  return (
    <span
      className="rounded capitalize inline-block font-normal box-border"
      style={{
        backgroundColor,
        color: '#424242',
        padding: '2px 6px',
      }}
    >
      {value}
    </span>
  );
}

Relationship.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  value: PropTypes.element.isRequired,
};

export default function Cell({
  value: initialValue,
  row: { index },
  column: { id, dataType, options },
  dataDispatch,
}) {
  const [value, setValue] = useState({ value: initialValue, update: false });
  const [selectRef, setSelectRef] = useState(null);
  const [selectPop, setSelectPop] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const onChange = (e) => {
    setValue({ value: e.target.value, update: false });
  };
  const [showAdd, setShowAdd] = useState(false);
  const [addSelectRef, setAddSelectRef] = useState(null);

  useEffect(() => {
    setValue({ value: initialValue, update: false });
  }, [initialValue]);

  useEffect(() => {
    if (value.update) {
      dataDispatch({
        type: 'update_cell',
        columnId: id,
        rowIndex: index,
        value: value.value,
      });
    }
  }, [value, dataDispatch, id, index]);

  function handleOptionKeyDown(e) {
    if (e.key === 'Enter') {
      if (e.target.value !== '') {
        dataDispatch({
          type: 'add_option_to_column',
          option: e.target.value,
          backgroundColor: randomColor(),
          columnId: id,
        });
      }
      setShowAdd(false);
    }
  }

  function handleAddOption() {
    setShowAdd(true);
  }

  function handleOptionBlur(e) {
    if (e.target.value !== '') {
      dataDispatch({
        type: 'add_option_to_column',
        option: e.target.value,
        backgroundColor: randomColor(),
        columnId: id,
      });
    }
    setShowAdd(false);
  }

  const { styles, attributes } = usePopper(selectRef, selectPop, {
    placement: 'bottom-start',
    strategy: 'fixed',
  });

  function getColor() {
    const match = options.find((option) => option.label === value.value);
    return (match && match.backgroundColor) || '#e0e0e0';
  }

  useEffect(() => {
    if (addSelectRef && showAdd) {
      addSelectRef.focus();
    }
  }, [addSelectRef, showAdd]);

  let element;
  switch (dataType) {
    case 'text':
      element = (
        <ContentEditable
          html={(value.value && value.value.toString()) || ''}
          onChange={onChange}
          onBlur={() => setValue((old) => ({ value: old.value, update: true }))}
          className="whitespace-pre-wrap border-0 p-2 text-gray-600 text-base rounded resize-none box-border flex-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      );
      break;
    case 'number':
      element = (
        <ContentEditable
          html={(value.value && value.value.toString()) || ''}
          onChange={onChange}
          onBlur={() => setValue((old) => ({ value: old.value, update: true }))}
          className="whitespace-pre-wrap border-0 p-2 text-gray-600 text-base rounded resize-none box-border flex-auto focus:outline-none  focus:ring-2 focus:ring-blue-400 text-right"
        />
      );
      break;
    case 'select':
      element = (
        <>
          <div
            ref={setSelectRef}
            className="p-2 flex cursor-default items-center flex-1"
            role="presentation"
            onClick={() => setShowSelect(true)}
            onKeyPress={() => setShowSelect(true)}
          >
            {value.value && (
              <Relationship value={value.value} backgroundColor={getColor()} />
            )}
          </div>
          {showSelect && (
            <div
              className="fixed top-0 left-0 h-screen w-screen overflow-hidden"
              role="presentation"
              onClick={() => setShowSelect(false)}
              onKeyPress={() => setShowSelect(false)}
            />
          )}
          {showSelect && (
            <div
              className="shadow-sm bg-white rounded-md p-3"
              ref={setSelectPop}
              {...attributes.popper}
              style={{
                ...styles.popper,
                zIndex: 4,
                minWidth: 200,
                maxWidth: 320,
              }}
            >
              <div className="flex flex-wrap -mt-2">
                {options.map((option) => (
                  <div
                    key={shortId()}
                    className="cursor-pointer mr-2 mt-2"
                    role="presentation"
                    onClick={() => {
                      setValue({ value: option.label, update: true });
                      setShowSelect(false);
                    }}
                    onKeyPress={() => {
                      setValue({ value: option.label, update: true });
                      setShowSelect(false);
                    }}
                  >
                    <Relationship
                      value={option.label}
                      backgroundColor={option.backgroundColor}
                    />
                  </div>
                ))}
                {showAdd && (
                  <div
                    className="mr-2 mt-2 rounded"
                    style={{
                      width: 120,
                      padding: '2px 4px',
                      backgroundColor: '#eeeeee',
                    }}
                  >
                    <input
                      type="text"
                      className="w-full text-base border-none bg-transparent focus:outline-none"
                      onBlur={handleOptionBlur}
                      ref={setAddSelectRef}
                      onKeyDown={handleOptionKeyDown}
                    />
                  </div>
                )}
                <div
                  className="cursor-pointer mr-2 mt-2"
                  role="presentation"
                  onClick={handleAddOption}
                  onKeyPress={handleAddOption}
                >
                  <Relationship
                    value={
                      <span className="relative text-gray-600">
                        {getIcon('plus')}
                      </span>
                    }
                    backgroundColor="#eeeeee"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      );
      break;
    default:
      element = <span />;
      break;
  }

  return element;
}
