test('the context for an event handler should be the event target', () => {
  const parent: HTMLElement = document.createElement('div');
  const child: HTMLElement = document.createElement('div');

  parent.appendChild(child);

  parent.addEventListener('click', function onClick(event: MouseEvent) {
    expect(this).toBe(parent);
    // target = element the event started from
    expect(event.target).toBe(child);
    // currentTarget = element the event handler is on
    expect(event.currentTarget).toBe(parent);
  });

  child.dispatchEvent(new MouseEvent('click', { bubbles: true }));
});
