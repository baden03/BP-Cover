function delete_pic_cover(activity_id, adminUrl){
    jQuery('#'+activity_id).children(".delete-pic").html("");
    jQuery('#'+activity_id ).children(".bpci-loading").show();
    jQuery.ajax({
        type: 'post',
        url: adminUrl,
        data: { action: "delete_pic_cover", activity_id:activity_id },
        success: function(data) {
        	jQuery('#'+activity_id).parent().hide();
        }
    });
}
function select_pic_rtmedia_for_cover(photo_id, adminUrl){
    jQuery.ajax({
        type: 'post',
        url: adminUrl,
        data: { action: "select_pic_rtmedia_for_cover", photo_id:photo_id, },
        success: function(data) {
        	 location.reload();
        }
     });
}

function select_pic_for_cover(activity_id, adminUrl){
    jQuery('#'+activity_id ).children(".bpci-loading").show();
    jQuery.ajax({
        type: 'post',
        url: adminUrl,
        data: { action: "select_pic_for_cover", activity_id:activity_id, },
        success: function(data) {
        	 location.reload();
        }
    });
}

jQuery('.btn-save').hide();

jQuery('.edit-cover').click(function() {
    jQuery('#profile-mass').fadeIn("slow");
    jQuery(".img-profile-header-background").css('cursor', 'pointer');
    var y1 = jQuery('.image-upload-container').height();
    var y2 = jQuery('.img-profile-header-background').height();
    var x1 = jQuery('.image-upload-container').width();
    var x2 = jQuery('.img-profile-header-background').width();

    jQuery(".img-profile-header-background").draggable({
        scroll: false,
        axis: "y",
        drag: function(event, ui) {
            if(ui.position.top >= 0){
                ui.position.top = 0;
            }
            else if(ui.position.top <= y1 - y2){
                ui.position.top = y1 - y2;
            }
        },
        stop: function(event, ui) {
            jQuery('input[name=id]').val(ui.position.top);
            jQuery('.edit-cover').hide();
            jQuery('#profile-mass').fadeOut("slow");
            jQuery('.btn-save').show();
        }
    });
});


jQuery(".btn-save").click(function () {
    var $selectedInput = jQuery("input[name=id]");
    jQuery.ajax({
        url: ajaxurl,
        type: 'POST',
        data: {
            action:'bp_cover_position',
            id : $selectedInput.val()
        },
        beforeSend: function() {
            jQuery('#bpci-polaroid-upload-banner').addClass('bpci-loading');
        },
        success: function(value) {
            jQuery(this).html(value);
            jQuery('#bpci-polaroid-upload-banner').removeClass('bpci-loading');
            jQuery('#mass-drag').fadeIn("slow");
            jQuery('.btn-save').hide();
            jQuery('.edit-cover').show();
            location.reload();
        }
    });
    return false;
});

jQuery('.uploadBox').each(function() {
    if (jQuery(this).attr('id') == "profilefileupload") {

        jQuery("input[name=avatar_filename]").change(function() {
            var file = jQuery('#avatar_pic').get(0).files[0];

            /* check file type, we only want images */
            if( file.type.indexOf('image') == -1 ) {
                alert('Please select an image file only.');
                return false;
            }

            name = file.name;
            size = file.size;
            type = file.type;

            var reader = new FileReader();

            jQuery('#bpci-polaroid-upload-avatar').addClass('bpci-loading');

            reader.onload = (function(theFile) {
                return function(e) {
                    bpciImageUpload(e.target.result, type, name,size);
                    return false;
                };
            })(file);

            reader.readAsDataURL(file);
            return false;
        });

        function bpciImageUpload( img, type, name,size ) {
            /*
            * ajaxurl is already defined in BuddyPress
            * if you're not using BuddyPress, you can define it this way :
            * ajaxurl = "<?php echo admin_url('admin-ajax.php');?>";
            */

            jQuery.post( ajaxurl, {
                action: 'bp_caver_avatar_handle_upload',
                'encodedimg': img,
                'imgtype':type,
                'imgname':name,
                'imgsize':size
            },
            function(response) {
                if( response[0] != "0" ) {
                    sendToContentEditableavatar( response[1], response[2]);
                }else{
                    alert(response[1]);
                    jQuery('#bpci-polaroid-upload-avatar').removeClass('bpci-loading');
                }
            }, 'json');
        }

        function sendToContentEditableavatar(fullimage, resizedimage){
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {"action": "bp_avatar_refresh"},
                success: function(data){
                    jQuery(".ava").html(data);
                }
            });
        }
    } else if (jQuery(this).attr('id') == "bannerfileupload") {
        jQuery("input[name=cover_filename]").change(function() {
            var file = jQuery('#cover_pic').get(0).files[0];

            /* check file type, we only want images */
            if( file.type.indexOf('image') == -1 ) {
                alert('Please select an image file only.');
                return false;
            }

            name = file.name;
            size = file.size;
            type = file.type;

            var reader = new FileReader();

            jQuery('#bpci-polaroid-upload-banner').addClass('bpci-loading');

            reader.onload = (function(theFile) {
                return function(e) {
                    bpciImageUploadava(e.target.result, type, name,size);
                    return false;
                };
            })(file);

            reader.readAsDataURL(file);

            return false;
        });

        function bpciImageUploadava( img, type, name,size ) {
            /*
            * ajaxurl is already defined in BuddyPress
            * if you're not using BuddyPress, you can define it this way :
            * ajaxurl = "<?php echo admin_url('admin-ajax.php');?>";
            */

            jQuery.post( ajaxurl, {
                action: 'bp_cover_handle_upload',
                'encodedimg': img,
                'imgtype':type,
                'imgname':name,
                'imgsize':size
            },
            function(response) {
                if( response[0] != "0" ) {
                    sendToContentEditable( response[1], response[2]);
                } else {
                    alert(response[1]);
                    jQuery('#bpci-polaroid-upload-banner').removeClass('bpci-loading');
                };
            }, 'json');
        }

        function sendToContentEditable(fullimage, resizedimage){
            jQuery.ajax({
                type: 'POST',
                url: ajaxurl,
                data: {"action": "bp_cover_refresh"},
                success: function(data){
                    //$(".image-upload-container").html(data);
                    location.reload();
                }
            });
        }
    }
});

jQuery(".btn-remove").click(function () {
    jQuery.ajax({
        url: ajaxurl,
        type: 'post',
        data: {'action': 'bp_cover_delete' },
        beforeSend:  function() {
            jQuery('#bpci-polaroid-upload-banner').addClass('bpci-loading');
        },
        success: function(data) {
            // $("#profile-mass").toggleClass('mass');
            jQuery('#bpci-polaroid-upload-banner').removeClass('bpci-loading');
            location.reload();
        }
    });
	return false;
 });
