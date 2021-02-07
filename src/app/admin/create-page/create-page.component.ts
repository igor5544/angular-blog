import { AlertService } from './../shared/services/alert.service';
import { PostService } from './../../shared/posts.service';
import { Post } from './../../shared/interfaces';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit {

  form!: FormGroup;

  constructor(private postService: PostService, private alertService: AlertService) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      text: new FormControl('', Validators.required),
      author: new FormControl('', Validators.required),
    })
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date(),
    }

    this.postService.create(post).subscribe(() => {
      this.form.reset();
      this.alertService.success('Пост был создан');
    });
  }
}
