import { AlertService } from './../shared/services/alert.service';
import { Post } from './../../shared/interfaces';
import { PostService } from './../../shared/posts.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  posts!: Post[];
  pSub!: Subscription;
  dSub!: Subscription;
  searchStr: string = '';

  constructor(private PostService: PostService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.pSub = this.PostService.getAll().subscribe((posts) => {
      this.posts = posts;
    })
  }

  ngOnDestroy() {
    this.pSub.unsubscribe();

    if (this.dSub) {
      this.dSub.unsubscribe;
    }
  }

  remove(id: string) {
    this.dSub = this.PostService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => {
        return post.id !== id;
      });
      this.alertService.danger('Пост был удалён');
    });
  }
}
