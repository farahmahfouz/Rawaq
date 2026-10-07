import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from '../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  constructor(private http: HttpClient) { }

  uploadAvatar(file: File) {
    const fileName = `${crypto.randomUUID()}-${file.name}`;

    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ Key: string }>(`${API.STORAGE}/uploads/users/${fileName}`, formData);
  }

  getAvatarUrl(fileName: string) {
    return `${API.STORAGE}/public/uploads/users/${fileName};`
  }
}
