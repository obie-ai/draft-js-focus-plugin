'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = insertNewLine;

var _immutable = require('immutable');

var _draftJs = require('draft-js');

var insertBlockAfterSelection = function insertBlockAfterSelection(contentState, selectionState, newBlock) {
  var targetKey = selectionState.getStartKey();
  var array = [];
  contentState.getBlockMap().forEach(function (block, blockKey) {
    array.push(block);
    if (blockKey !== targetKey) return;
    array.push(newBlock);
  });
  return contentState.merge({
    blockMap: _draftJs.BlockMapBuilder.createFromArray(array),
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: newBlock.getKey(),
      anchorOffset: newBlock.getLength(),
      focusKey: newBlock.getKey(),
      focusOffset: newBlock.getLength(),
      isBackward: false
    })
  });
};

var insertBlockBeforeSelection = function insertBlockBeforeSelection(contentState, selectionState, newBlock) {
  var targetKey = selectionState.getStartKey();
  var targetIndex = 0;
  var array = [];
  contentState.getBlockMap().forEach(function (block, blockKey) {
    array.push(block);
    if (blockKey === targetKey) {
      array.splice(array.length - 1, 0, newBlock);
    }
  });

  return contentState.merge({
    blockMap: _draftJs.BlockMapBuilder.createFromArray(array),
    selectionBefore: selectionState,
    selectionAfter: selectionState.merge({
      anchorKey: newBlock.getKey(),
      anchorOffset: newBlock.getLength(),
      focusKey: newBlock.getKey(),
      focusOffset: newBlock.getLength(),
      isBackward: false,
    }),
  });
};

function insertNewLine(editorState) {
  var contentState = editorState.getCurrentContent();
  var selectionState = editorState.getSelection();
  var newLineBlock = new _draftJs.ContentBlock({
    key: (0, _draftJs.genKey)(),
    type: 'unstyled',
    text: '',
    characterList: (0, _immutable.List)()
  });
  var withNewLine = insertBlockBeforeSelection(contentState, selectionState, newLineBlock);
  var newContent = withNewLine.merge({
    selectionAfter: withNewLine.getSelectionAfter().set('hasFocus', true)
  });
  return _draftJs.EditorState.push(editorState, newContent, 'insert-fragment');
}