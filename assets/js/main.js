$(function () {
      var inst = new mdui.Fab('#fab');
      $('#transform').click(function () {
        var hash = $("#magnet").val()

        $('#error').hide();
        $('#download').hide();
        $.post("https://www.offcloud.net/php/magnet2bt.php", { hash: hash }, function (result) {
          if (result.error) {
            $('#error').html(`
            <div class="alert alert-danger" >
              <div class="container">
                <div class="alert-icon">
                  <i class="material-icons">info_outline</i>
                </div>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true"><i class="material-icons">clear</i></span>
                </button>
                <b>Error:</b> 转换失败,请稍后再试
              </div>
            </div>`);
            $('#error').fadeIn();

          } else {
            $('#download').fadeIn();
            $('#download').attr('href', 'https://www.offcloud.net' + result.url);
          }
        }, "json");
      });
      $("#file").on("change", function (e) {
        $.each(this.files, function (k, v) {
          var reader = new FileReader();//这里是核心！！！读取操作就是由它完成的。
          reader.readAsBinaryString(v);//读取文件的内容
          reader.onload = function () {
            $("#filename").text(v.name);
            $("#btnTorrentDetail").fadeOut();
            try {
              var torrent = analyseBT(this.result);
              var hash = "magnet:?xt=urn:btih:" + torrent.data.hash
              $(".modal-header .card-title").text(torrent.data.name)
              $('.modal-body').html(generateList(torrent.data.files));
              $("#generateMagnet").val(hash);
              $("#btnTorrentDetail").fadeIn();
            } catch (error) {
              $("#generateMagnet").val("请打开种子文件");

            }


          };

        });
      });
      function generateList(files) {
        var html = `<ul class="mdui-list mdui-list-dense">`

        files.forEach(file => {
          html += `<li class="mdui-list-item">
              <i class="mdui-list-item-icon mdui-icon material-icons mdui-text-color-indigo">move_to_inbox</i>
              <div class="mdui-list-item-content">
                <div class="mdui-list-item-title mdui-list-item-one-line">`+ file.index + "." + file.name + `</div>
                <div class="mdui-list-item-text mdui-list-item-one-line">
                  `+ file.size + `
                </div>
              </div>
            </li>`
        });


        html += `</ul>`
        return html;
      }
    });