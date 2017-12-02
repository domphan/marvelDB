function searchFunction() {
  var input, filter, h4, div, i;
  input = document.getElementById('searchBar');
  //make everything uppercase, so search is case insensitive
  filter = input.value.toUpperCase();
  div = document.getElementsByClassName('searchTerm');

  for (i = 0; i < div.length; i++) {
    h4 = div[i].getElementsByTagName("h4")[0];
    if (h4.innerHTML.toUpperCase().indexOf(filter) > - 1) {
      div[i].style.display = "";
    } else {
      div[i].style.display = "none";
    }
  }
}
