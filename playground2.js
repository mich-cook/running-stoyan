const headers = [ "mission", "shuttle", "date" ];
const data = [
{
  "mission": "1",
  "shuttle": "Challenger",
  "date": "6"
},
{
  "mission": "2",
  "shuttle": "Enterprise",
  "date": "7"
},
{
  "mission": "3",
  "shuttle": "Atlantis",
  "date": "8"
}
];

const Table = createReactClass({

  "propTypes": {
    "headers": PropTypes.arrayOf(PropTypes.string),
    "initialData": PropTypes.arrayOf(PropTypes.shape({
      "mission": PropTypes.string.isRequired,
      "shuttle": PropTypes.string.isRequired,
      "date": PropTypes.string.isRequired
    }))
  },

  "getInitialState": function() {
    return {
      "data": this.props.initialData,
      "sortBy": null,
      "descending": false,
      "editMarker": null
    };
  },

  "sort": function(e) {
    const column = e.target.dataset.column;
    const desc = (this.state.sortBy === column) ? !this.state.descending : false;
    let missions = Array.from(this.state.data);
    missions.sort(function(a,b) {
      if (desc === false) {
        return (a[column] > b[column]) ? 1 : -1;
      } else {
        return (a[column] < b[column]) ? 1 : -1;
      }
    });
    this.setState({ "data": missions, "descending": desc, "sortBy": column });
  },

  "editable": function(e) {
    const row = e.target.closest('tr').rowIndex - 1;
    const column = e.target.cellIndex;
    // not using dataset.column at the end to minimize confusion between the key and the var
    const key = document.querySelectorAll('table tr th')[column].dataset["column"];

    this.setState({ "editMarker": { "row": row, "column": column, "key": key }});
  },

  "updateTable": function(e) {
    e.preventDefault();

    let data = Array.from(this.state.data);
    const newVal = e.target.querySelector('input').value;

    data[this.state.editMarker.row][this.state.editMarker.key] = newVal;
    this.setState({ "data": data, "editMarker": null });
  },

  "render": function() {
    return (
      React.createElement("table", null,
        React.createElement("thead", { "onClick": this.sort },
          React.createElement("tr", null, this.props.headers.map(function(heading, i) {
            let sortDir = '\u2195';  // updown by default
            if (heading === this.state.sortBy) {
              if (this.state.descending === false) { sortDir = "\u2193"; }
              else { sortDir = "\u2191"; }
            }
            return React.createElement("th", { "key": i, "data-column": heading }, heading + sortDir);
          }, this))
        ),
        React.createElement("tbody", { /* "onDoubleClick": this.editable */ }, this.state.data.map(function(row, i) {
          if ((this.state.editMarker !== null) && (this.state.editMarker.row === i)) {
            let editField = React.createElement("form", { "onSubmit": this.updateTable },
              React.createElement("input", { "type": "text", "defaultValue": row[this.state.editMarker.key], "placeholder": row[this.state.editMarker.key] })
            );
            row[this.state.editMarker.key] = editField;
          }
          return (
            React.createElement("tr", { "key": i },
              React.createElement("td", null, row.mission),
              React.createElement("td", null, row.shuttle),
              React.createElement("td", null, row.date)
            )
          );
        }, this))
      )
    );
  }
});

ReactDOM.render(
  React.createElement(Table, { headers, "initialData": data }),
  document.getElementById("react-app")
);
