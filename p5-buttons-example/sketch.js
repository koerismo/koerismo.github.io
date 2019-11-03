var myButton;
function setup() {
    myButton = new button()
    myButton.place(0,0,100,100)
    myButton.content = 'My Button!'
    myButton.onClick = function() {
        alert('Button was clicked!')
    }
}
function draw() {
    myButton.draw()
}
