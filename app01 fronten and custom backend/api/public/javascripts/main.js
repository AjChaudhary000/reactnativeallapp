const deleteCat = (id) => {
  $.ajax({
    url: "/dashboard/category/" + id,
    type: "DELETE",
    success: function (result) {
      console.log(result);
      location.reload();
    },
  });
};

$(".legal").richText();
