import React, { useState } from "react";
import { Form, Input, Button, message, Card, Modal } from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../config/firebase";  // Đường dẫn đến file firebase.js
import api from "../../../config/axios";

function DesignBlog() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editorData, setEditorData] = useState("");

  // Custom Upload Adapter to handle image upload to Firebase
  class MyUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file
        .then((file) => {
          return new Promise((resolve, reject) => {
            const storageRef = ref(storage, `images/${file.name}`); // Tạo ref tới file trong Firebase Storage
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                // Có thể thêm phần xử lý progress nếu cần
              },
              (error) => {
                reject(error); // Xử lý lỗi upload
              },
              () => {
                // Upload thành công, lấy URL từ Firebase Storage
                getDownloadURL(uploadTask.snapshot.ref)
                  .then((downloadURL) => {
                    console.log("File available at:", downloadURL); // Kiểm tra URL của file
                    resolve({
                      default: downloadURL,  // CKEditor sẽ sử dụng URL này để hiển thị ảnh
                    });
                  })
                  .catch((error) => {
                    reject(error); // Xử lý lỗi nếu không lấy được URL
                  });
              }
            );
          });
        });
    }

    abort() {
      // Optional: xử lý abort nếu cần
    }
  }

  // Plugin to integrate the custom upload adapter
  function MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new MyUploadAdapter(loader);
    };
  }

  // Handle form submission (create blog draft)
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Gửi dữ liệu blog draft lên server
      await api.post("/api/blog/drafts", { ...values, content: editorData });
      message.success("Blog draft created successfully");
      form.resetFields();
      setEditorData("");
      setModalVisible(false);
    } catch (err) {
      message.error(
        "Failed to create blog draft: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Open modal to confirm submitting the blog draft
  const openSubmitModal = (post) => {
    setSelectedPost(post);
    setSubmitModalVisible(true);
  };

  // Handle blog draft submission
  const handleSubmitBlog = async () => {
    if (!selectedPost) return;
    try {
      await api.post(`/api/blog/drafts/${selectedPost.id}/submit`);
      message.success("Blog submitted successfully");
      setSubmitModalVisible(false);
      setSelectedPost(null);
    } catch (err) {
      message.error(
        "Failed to submit blog: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
      <Card title="Create Blog Draft" bordered={false} style={{ marginBottom: 24 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter blog title" />
          </Form.Item>

          <Form.Item label="Content" rules={[{ required: true }]}>
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorData(data);
              }}
              config={{
                extraPlugins: [MyCustomUploadAdapterPlugin], // Thêm plugin tùy chỉnh để upload ảnh
                toolbar: [
                  "heading", "|",
                  "bold", "italic", "link", "|",
                  "imageUpload", "|",
                  "bulletedList", "numberedList", "|",
                  "blockQuote", "undo", "redo",
                ],
              }}
            />
          </Form.Item>

          <Form.Item name="coverImageUrl" label="Image URL" rules={[{ required: true }]}>
            <Input placeholder="Enter blog image URL" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Blog Draft
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Submit confirmation modal */}
      <Modal
        title="Submit Blog"
        visible={submitModalVisible}
        onOk={handleSubmitBlog}
        onCancel={() => setSubmitModalVisible(false)}
      >
        <p>Are you sure you want to submit this blog?</p>
      </Modal>
    </div>
  );
}

export default DesignBlog;
