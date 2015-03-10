describe('angularjs homepage todo list', function() {
  it('should click a button to go to the ', function() {
    browser.get('http://127.0.0.1:8000/app/views/poll.html');

    element(by.model('todoText')).sendKeys('write a protractor test');
    element(by.css('[value="add"]')).click();

    var todoList = element.all(by.repeater('todo in todos'));
    expect(todoList.count()).toEqual(3);
    expect(todoList.get(2).getText()).toEqual('write a protractor test');
  });
});