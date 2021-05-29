import React, { useState, useEffect } from 'react';
import { usePopper } from 'react-popper';
import getIcon from '../Icons/Icons';
import { shortId } from '../utils/ui_utils';

export default function Header({
  column: { id, created, label, dataType, getResizerProps, getHeaderProps },
  setSortBy,
  dataDispatch,
}) {
  const [expanded, setExpanded] = useState(created || false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [inputRef, setInputRef] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: 'bottom',
    strategy: 'absolute',
  });
  const [header, setHeader] = useState(label);
  const [typeReferenceElement, setTypeReferenceElement] = useState(null);
  const [typePopperElement, setTypePopperElement] = useState(null);
  const [showType, setShowType] = useState(false);
  const buttons = [
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_header',
          columnId: id,
          label: header,
        });
        setSortBy([{ id, desc: false }]);
        setExpanded(false);
      },
      icon: getIcon('arrowup'),
      label: 'Sort ascending',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_header',
          columnId: id,
          label: header,
        });
        setSortBy([{ id, desc: true }]);
        setExpanded(false);
      },
      icon: getIcon('arrowdown'),
      label: 'Sort descending',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_header',
          columnId: id,
          label: header,
        });
        dataDispatch({
          type: 'add_column_to_left',
          columnId: id,
          focus: false,
        });
        setExpanded(false);
      },
      icon: getIcon('arrowleft'),
      label: 'Insert left',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_header',
          columnId: id,
          label: header,
        });
        dataDispatch({
          type: 'add_column_to_right',
          columnId: id,
          focus: false,
        });
        setExpanded(false);
      },
      icon: getIcon('arrowright'),
      label: 'Insert right',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_header',
          columnId: id,
          label: header,
        });
        dataDispatch({ type: 'delete_column', columnId: id });
        setExpanded(false);
      },
      icon: getIcon('trash'),
      label: 'Delete',
    },
  ];

  const types = [
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_type',
          columnId: id,
          dataType: 'select',
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: getIcon('multi'),
      label: 'Select',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_type',
          columnId: id,
          dataType: 'text',
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: getIcon('text'),
      label: 'Text',
    },
    {
      onClick: () => {
        dataDispatch({
          type: 'update_column_type',
          columnId: id,
          dataType: 'number',
        });
        setShowType(false);
        setExpanded(false);
      },
      icon: getIcon('hash'),
      label: 'Number',
    },
  ];

  let propertyIcon;
  switch (dataType) {
    case 'number':
      propertyIcon = getIcon('hash');
      break;
    case 'text':
      propertyIcon = getIcon('text');
      break;
    case 'select':
      propertyIcon = getIcon('multi');
      break;
    default:
      break;
  }

  useEffect(() => {
    if (created) {
      setExpanded(true);
    }
  }, [created]);

  useEffect(() => {
    setHeader(label);
  }, [label]);

  useEffect(() => {
    if (inputRef) {
      inputRef.focus();
      inputRef.select();
    }
  }, [inputRef]);

  const typePopper = usePopper(typeReferenceElement, typePopperElement, {
    placement: 'right',
    strategy: 'fixed',
  });

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      dataDispatch({
        type: 'update_column_header',
        columnId: id,
        label: header,
      });
      setExpanded(false);
    }
  }

  function handleChange(e) {
    setHeader(e.target.value);
  }

  function handleBlur(e) {
    e.preventDefault();
    dataDispatch({ type: 'update_column_header', columnId: id, label: header });
  }

  return id !== 999999 ? (
    <>
      <div
        {...getHeaderProps({ style: { display: 'inline-block' } })}
        className="text-gray-400 font-medium text-sm cursor-pointer"
      >
        <div
          role="presentation"
          className="text-gray-600 bg-gray-200 flex flex-wrap h-full font-medium text-base cursor-pointer content-center hover:bg-gray-300"
          onClick={() => setExpanded(true)}
          onKeyPress={() => setExpanded(true)}
          ref={setReferenceElement}
        >
          <span className="relative stroke-current ml-2 mr-1">
            {propertyIcon}{' '}
          </span>
          {label}
        </div>
        <div
          {...getResizerProps()}
          className="inline-block bg-transparent w-2 h-full absolute right-0 top-0 transform translate-x-2/4 z-10 hover:bg-gray-300"
        />
      </div>
      {expanded && (
        <div
          role="presentation"
          className="fixed top-0 left-0 h-screen w-screen overflow-hidden"
          onClick={() => setExpanded(false)}
          onKeyPress={() => setExpanded(false)}
        />
      )}
      {expanded && (
        // Menu
        <div
          ref={setPopperElement}
          style={{ ...styles.popper, zIndex: 3 }}
          {...attributes.popper}
        >
          {/* Menu Background */}
          <div
            className="bg-gray-50 shadow-sm rounded-md"
            style={{
              width: 200,
            }}
          >
            {/* Column Name Input */}
            <div className="pt-3 pl-3 pr-3">
              <div className="w-full" style={{ marginBottom: 12 }}>
                <input
                  className="p-1.5 bg-gray-100 bornder-none rounded text-sm w-full text-gray-600 focus:outline-none shadow-sm"
                  ref={setInputRef}
                  type="text"
                  value={header}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
              </div>
              {/* Property Type - Icon and Label */}
              <span
                className="font-semibold text-xs uppercase"
                style={{ color: '#9e9e9e' }}
              >
                Data Type
              </span>
            </div>
            {/* Property Type Select Menu */}
            <div style={{ padding: '4px 0px' }}>
              <button
                className="pt-1 pl-3 w-full bg-transparent border-0 text-sm bg-gray-50 cursor-pointer text-left flex items-center hover:bg-gray-200"
                type="button"
                onMouseEnter={() => setShowType(true)}
                onMouseLeave={() => setShowType(false)}
                ref={setTypeReferenceElement}
              >
                <span className="relative text-gray-600 mr-1">
                  {propertyIcon}
                </span>
                <span className="capitalize">{dataType} </span>
              </button>
              {showType && (
                <div
                  className="shadow-sm bg-white border-radius-m"
                  ref={setTypePopperElement}
                  onMouseEnter={() => setShowType(true)}
                  onMouseLeave={() => setShowType(false)}
                  {...typePopper.attributes.popper}
                  style={{
                    ...typePopper.styles.popper,
                    width: 200,
                    zIndex: 4,
                    padding: '4px 0px',
                  }}
                >
                  {types.map((type) => (
                    <button
                      key={shortId()}
                      type="button"
                      className="pt-1 pl-3 w-full bg-transparent border-0 text-sm bg-gray-50 cursor-pointer text-left flex items-center hover:bg-gray-200"
                      onClick={type.onClick}
                    >
                      <span className="relative text-gray-600 mr-1">
                        {type.icon}
                      </span>
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Sort/Add/Delete */}
            <div
              key={shortId()}
              style={{
                borderTop: `2px solid #eeeeee}`,
                padding: '4px 0px',
              }}
            >
              <div className="pt-3 pl-3 pr-3">
                <span
                  className="font-semibold text-xs uppercase"
                  style={{ color: '#9e9e9e' }}
                >
                  Functions
                </span>
              </div>

              {buttons.map((button) => (
                <button
                  key={shortId()}
                  type="button"
                  className="pt-1 pl-3 w-full bg-transparent border-0 text-sm bg-gray-50 cursor-pointer text-left flex items-center hover:bg-gray-200"
                  onMouseDown={button.onClick}
                >
                  <span className="relative text-gray-600 mr-1">
                    {button.icon}
                  </span>
                  {button.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    // Add Column
    <div
      {...getHeaderProps({ style: { display: 'inline-block' } })}
      className="text-gray-200 font-medium text-sm cursor-pointer"
    >
      <div
        role="presentation"
        className="bg-gray-300 overflow-x-hidden overflow-ellipsis p-2 flex items-center justify-center hover:bg-gray-200"
        onClick={() =>
          dataDispatch({
            type: 'add_column_to_left',
            columnId: 999999,
            focus: true,
          })
        }
        onKeyPress={() =>
          dataDispatch({
            type: 'add_column_to_left',
            columnId: 999999,
            focus: true,
          })
        }
      >
        {/* Column Plus Icon */}
        <span className="relative stroke-current">{getIcon('plus')}</span>
      </div>
    </div>
  );
}
