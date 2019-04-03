/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function(config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.filebrowserUploadUrl = '/getImg?type=File';
    config.filebrowserImageUploadUrl = "/getImg?type=image";
    config.filebrowserFlashUploadUrl = '/getImg?type=Flash';
    config.image_previewText = ' ';
};