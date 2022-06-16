import { Injectable } from '@angular/core';
const Klazify_API = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiYTc5OTEyNmZiZjZkOTE0NGUyMGNjNjFiYmM5ZWY1YWUzYWRmZWQzNjRhMDhiMDgzNjVhZWMzZjA0MDk3MzZhN2I5Y2Q2MWQxNjdhMjRiYzAiLCJpYXQiOjE2NTUzNzE3NjgsIm5iZiI6MTY1NTM3MTc2OCwiZXhwIjoxNjg2OTA3NzY4LCJzdWIiOiI2Mzk2Iiwic2NvcGVzIjpbXX0.HAMnC8fd8Ud2YyYP4L6ckCQM-qQB-Psucm5DWB4JDjYpR6rBq0fekkplrx1BR-01kUMv1uHxcAS8WV9skCmdNg'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getCompanyInfo(url: string) {
    const headers = new Headers({
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Klazify_API}`,
    })
  }
}
