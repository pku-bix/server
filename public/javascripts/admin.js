$(function(){

  // 初始化
  var map = new BMap.Map("baidumap");
  var geoc = new BMap.Geocoder();
  var geolocation = new BMap.Geolocation();
  var pt_current = new BMap.Point(116.331398,39.897445);
  var marker = new BMap.Marker(pt_current);
  map.centerAndZoom(pt_current,16);

  // 定位
  geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
      map.panTo(r.point);
      pt_current = r.point;
    }
    else console.error('failed to locate: '+this.getStatus());

    // 标记
    marker = new BMap.Marker(pt_current); // 创建标记
    marker.enableDragging();              // 可拖拽
    map.addOverlay(marker);               // 创建标记
    map.centerAndZoom(pt_current,16);

    // 反向编码
    geoc.getLocation(pt_current, function(rs){
      var addComp = rs.addressComponents;
      $('input#location').val(addComp.province 
        + addComp.city 
        + addComp.district 
        + addComp.street 
        + addComp.streetNumber);
      $('#encode-map').click()
    });   
  },{enableHighAccuracy: true})

  // 定位到location
  $('#search').click(function(){
    geoc.getPoint($('input#location').val(), function(point){
      if (point) {
        marker.setPosition(point)
        map.centerAndZoom(point, 16);
      }
    })
  })

  // 获得经纬度
  $('#encode-map').click(function(){
    var point = marker.getPosition()
    $('[name="lng"]').val(point.lng)
    $('[name="lat"]').val(point.lat)
  })

  // 删除用户
  $('.delete').click(function(){
    var id = $(this).parents('tr').data('id')
    $.post('/api/pile/delete',{id:id},function(){
      location.reload()
    })
  })
})
