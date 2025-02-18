// expandable-text.directive.ts
import { AfterContentChecked, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[expandableText]',
  standalone: true
})
export class ExpandableTextDirective implements AfterContentChecked {
  private readonly maxLength = 45;
  private fullText = '';
  private isExpanded = false;
  private isInitialized = false;
  private container: HTMLElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.container = this.el.nativeElement;
  }

  ngAfterContentChecked() {
    const currentText = this.container.textContent?.trim() || '';

    // Only initialize if we have new content and haven't initialized yet
    if (currentText && currentText !== this.fullText && !this.isInitialized) {
      this.fullText = currentText;

      // Only add the expand/collapse functionality if text exceeds maxLength
      if (this.fullText.length > this.maxLength) {
        this.setupExpandableText();
        this.isInitialized = true;
      }
    }
  }

  private setupExpandableText() {
    // Clear the original content
    this.container.textContent = '';

    // Create text container
    const textSpan = this.renderer.createElement('span');
    this.renderer.appendChild(this.container, textSpan);

    // Create toggle link
    const toggleLink = this.renderer.createElement('a');
    this.renderer.setStyle(toggleLink, 'color', '#60A5FA'); // text-blue-400
    this.renderer.setStyle(toggleLink, 'cursor', 'pointer');
    this.renderer.setStyle(toggleLink, 'margin-left', '4px');
    this.renderer.listen(toggleLink, 'click', () => this.toggleText(textSpan, toggleLink));

    // Add both elements to the container
    this.renderer.appendChild(this.container, toggleLink);

    // Initial state
    this.updateText(textSpan, toggleLink);
  }

  private toggleText(textSpan: HTMLElement, toggleLink: HTMLElement) {
    this.isExpanded = !this.isExpanded;
    this.updateText(textSpan, toggleLink);
  }

  private updateText(textSpan: HTMLElement, toggleLink: HTMLElement) {
    if (this.isExpanded) {
      this.renderer.setProperty(textSpan, 'textContent', this.fullText);
      this.renderer.setProperty(toggleLink, 'textContent', ' Show less');
    } else {
      const truncatedText = this.fullText.substring(0, this.maxLength) + '...';
      this.renderer.setProperty(textSpan, 'textContent', truncatedText);
      this.renderer.setProperty(toggleLink, 'textContent', ' Read more');
    }
  }
}
